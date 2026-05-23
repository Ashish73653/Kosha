import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

async function getUserId() {
  const session = await auth();
  if (session?.user?.id) {
    return session.user.id;
  }
  let demoUser = await db.user.findUnique({
    where: { email: "demo@kosha.app" },
  });
  if (!demoUser) {
    demoUser = await db.user.create({
      data: {
        name: "Kosha User",
        email: "demo@kosha.app",
      },
    });
  }
  return demoUser.id;
}

export async function GET() {
  try {
    const userId = await getUserId();
    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    
    // Format response to match the client's expectations (including category name)
    const formatted = await Promise.all(
      transactions.map(async (tx) => {
        let categoryName = "Other";
        if (tx.categoryId) {
          const cat = await db.category.findUnique({
            where: { id: tx.categoryId },
          });
          categoryName = cat?.name || "Other";
        }
        return {
          id: tx.id,
          description: tx.description,
          amount: tx.amount,
          category: categoryName,
          date: tx.date,
          type: tx.type.toLowerCase(),
        };
      })
    );

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    const { amount, type, description, category } = body;

    let categoryId = undefined;
    if (category) {
      const existingCategory = await db.category.findFirst({
        where: { name: category, userId },
      });
      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const newCat = await db.category.create({
          data: {
            name: category,
            userId,
            type: type === "income" ? "INCOME" : "EXPENSE",
          }
        });
        categoryId = newCat.id;
      }
    }

    const transaction = await db.transaction.create({
      data: {
        amount: parseFloat(amount),
        type: type === "income" ? "INCOME" : "EXPENSE",
        description,
        date: new Date(),
        userId,
        categoryId,
      },
    });

    return NextResponse.json({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      category: category || "Other",
      date: transaction.date,
      type: type,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const userId = await getUserId();
    await db.transaction.deleteMany({
      where: { id, userId },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
