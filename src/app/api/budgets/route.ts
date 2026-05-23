import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

async function getUserId() {
  const session = await auth();
  return session?.user?.id || null;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const budgets = await db.budget.findMany({
      where: { userId },
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const formatted = await Promise.all(
      budgets.map(async (b) => {
        // Query spent amount from transactions
        const categoryFilter = b.categoryId ? { categoryId: b.categoryId } : { description: { contains: b.name } };
        
        const txs = await db.transaction.findMany({
          where: {
            userId,
            type: "EXPENSE",
            date: { gte: startOfMonth },
            ...categoryFilter,
          },
        });
        
        const totalSpent = txs.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        return {
          id: b.id,
          name: b.name,
          limit: b.amount,
          spent: totalSpent,
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
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { name, limit } = body;

    // Check if category exists
    let category = await db.category.findFirst({
      where: { name, userId },
    });
    if (!category) {
      category = await db.category.create({
        data: {
          name,
          userId,
          type: "EXPENSE",
        },
      });
    }

    // Check if budget already exists for this category
    const existingBudget = await db.budget.findFirst({
      where: { name, userId },
    });

    let budget;
    if (existingBudget) {
      budget = await db.budget.update({
        where: { id: existingBudget.id },
        data: { amount: parseFloat(limit) },
      });
    } else {
      budget = await db.budget.create({
        data: {
          name,
          amount: parseFloat(limit),
          userId,
          categoryId: category.id,
        },
      });
    }

    return NextResponse.json({
      id: budget.id,
      name: budget.name,
      limit: budget.amount,
      spent: 0,
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
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await db.budget.deleteMany({
      where: { id, userId },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
