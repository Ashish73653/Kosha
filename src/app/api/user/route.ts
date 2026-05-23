import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

async function getUserId() {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  
  let demoUser = await db.user.findUnique({ where: { email: "demo@kosha.app" } });
  if (!demoUser) {
    demoUser = await db.user.create({
      data: { name: "Kosha User", email: "demo@kosha.app", currency: "INR" },
    });
  }
  return demoUser.id;
}

export async function GET() {
  try {
    const userId = await getUserId();
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        currency: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    const { name, email, currency } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if email is already taken by another user
    const existing = await db.user.findFirst({
      where: {
        email,
        id: { not: userId },
      },
    });
    if (existing) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        currency: currency || "INR",
      },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      currency: updated.currency,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
