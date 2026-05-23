import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

async function getUserId() {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  
  // Fallback to demo user if no session (same as other dashboard APIs)
  let demoUser = await db.user.findUnique({ where: { email: "demo@kosha.app" } });
  if (!demoUser) {
    demoUser = await db.user.create({
      data: { name: "Kosha User", email: "demo@kosha.app" },
    });
  }
  return demoUser.id;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json([]);

    const notifications = [];
    const now = new Date();

    // 1. Check if any budget is exceeded (spent > limit)
    const budgets = await db.budget.findMany({ where: { userId } });
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    for (const b of budgets) {
      const categoryFilter = b.categoryId ? { categoryId: b.categoryId } : { description: { contains: b.name } };
      const curBudgetTxs = await db.transaction.findMany({
        where: {
          userId,
          type: "EXPENSE",
          date: { gte: startOfMonth },
          ...categoryFilter,
        },
      });
      const spent = curBudgetTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      if (spent > b.amount) {
        notifications.push({
          id: `budget-${b.id}-${Math.floor(spent)}`,
          title: "Budget Exceeded",
          message: `Your spending on ${b.name} (₹${spent.toFixed(0)}) has exceeded your limit of ₹${b.amount.toFixed(0)}.`,
          type: "warning",
          date: new Date().toISOString(),
        });
      }
    }

    // 2. Check if any subscription is renewal due in next 3 days
    const subscriptions = await db.subscription.findMany({ where: { userId } });
    for (const sub of subscriptions) {
      const nextBilling = new Date(sub.nextBillingDate);
      const diffTime = nextBilling.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 3) {
        notifications.push({
          id: `sub-${sub.id}`,
          title: "Subscription Renewal Soon",
          message: `Your subscription for ${sub.name} (₹${sub.amount.toFixed(0)}) is due in ${diffDays} day${diffDays === 1 ? "" : "s"}.`,
          type: "info",
          date: new Date().toISOString(),
        });
      }
    }

    // 3. Welcome Notification (unread by default, unless read)
    notifications.push({
      id: "welcome-kosha",
      title: "Welcome to Kosha!",
      message: "Your futuristic personal finance dashboard is fully functional.",
      type: "success",
      date: new Date(now.getTime() - 15 * 60000).toISOString(), // 15 mins ago
    });

    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
