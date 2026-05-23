import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

async function getUserId() {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
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

    // Past 6 months cash flow data
    const cashFlowData = [];
    const spendingByCategory = [];
    
    const now = new Date();
    
    // 1. Cash flow (past 6 months)
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      const monthName = monthStart.toLocaleString("default", { month: "short" });

      const txs = await db.transaction.findMany({
        where: {
          userId,
          date: { gte: monthStart, lte: monthEnd },
        },
      });

      const income = txs.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
      const expenses = txs.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + Math.abs(t.amount), 0);

      cashFlowData.push({
        name: monthName,
        income,
        expenses,
      });
    }

    // 2. Spending by category (current month)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const curMonthExpenses = await db.transaction.findMany({
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: monthStart },
      },
    });

    const categoryMap: Record<string, number> = {};
    for (const tx of curMonthExpenses) {
      let categoryName = "Other";
      if (tx.categoryId) {
        const cat = await db.category.findUnique({ where: { id: tx.categoryId } });
        categoryName = cat?.name || "Other";
      }
      categoryMap[categoryName] = (categoryMap[categoryName] || 0) + Math.abs(tx.amount);
    }

    const colors = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#0EA5E9", "#6B7280"];
    let colorIdx = 0;
    for (const [name, value] of Object.entries(categoryMap)) {
      spendingByCategory.push({
        name,
        value,
        color: colors[colorIdx % colors.length],
      });
      colorIdx++;
    }

    return NextResponse.json({
      cashFlow: cashFlowData,
      spendingByCategory: spendingByCategory.length > 0 ? spendingByCategory : [
        { name: "No Expenses", value: 0, color: "#6B7280" }
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
