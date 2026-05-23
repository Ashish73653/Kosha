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
    const goals = await db.savingsGoal.findMany({
      where: { userId },
    });
    
    const formatted = goals.map((g) => ({
      id: g.id,
      name: g.name,
      current: g.currentAmount,
      target: g.targetAmount,
      color: g.color,
      icon: g.icon,
      date: g.deadline ? g.deadline.toISOString().split("T")[0] : "",
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
    const { name, target, icon, date } = body;

    const goal = await db.savingsGoal.create({
      data: {
        name,
        targetAmount: parseFloat(target),
        currentAmount: 0,
        icon: icon || "💰",
        deadline: date ? new Date(date) : null,
        userId,
      },
    });

    return NextResponse.json({
      id: goal.id,
      name: goal.name,
      current: goal.currentAmount,
      target: goal.targetAmount,
      color: goal.color,
      icon: goal.icon,
      date: goal.deadline ? goal.deadline.toISOString().split("T")[0] : "",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { id, amount } = body;

    const existingGoal = await db.savingsGoal.findFirst({
      where: { id, userId },
    });
    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const updated = await db.savingsGoal.update({
      where: { id },
      data: {
        currentAmount: existingGoal.currentAmount + parseFloat(amount),
      },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      current: updated.currentAmount,
      target: updated.targetAmount,
      color: updated.color,
      icon: updated.icon,
      date: updated.deadline ? updated.deadline.toISOString().split("T")[0] : "",
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
    await db.savingsGoal.deleteMany({
      where: { id, userId },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
