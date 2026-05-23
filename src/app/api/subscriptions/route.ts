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
    const subscriptions = await db.subscription.findMany({
      where: { userId },
    });

    const formatted = subscriptions.map((s) => ({
      id: s.id,
      name: s.name,
      amount: s.amount,
      interval: s.billingCycle.toLowerCase(),
      date: s.nextBillingDate.toISOString().split("T")[0],
      category: s.category || "Other",
      color: "#8B5CF6", // default subscription color
    }));

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
    const { name, amount, interval, date, category } = body;

    const subscription = await db.subscription.create({
      data: {
        name,
        amount: parseFloat(amount),
        billingCycle: interval === "yearly" ? "YEARLY" : "MONTHLY",
        nextBillingDate: date ? new Date(date) : new Date(Date.now() + 86400000 * 30),
        category: category || "Other",
        userId,
      },
    });

    return NextResponse.json({
      id: subscription.id,
      name: subscription.name,
      amount: subscription.amount,
      interval: subscription.billingCycle.toLowerCase(),
      date: subscription.nextBillingDate.toISOString().split("T")[0],
      category: subscription.category || "Other",
      color: "#8B5CF6",
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
    await db.subscription.deleteMany({
      where: { id, userId },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
