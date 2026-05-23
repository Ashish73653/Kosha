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

    // 1. Fetch transactions
    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    // 2. Fetch budgets
    const budgets = await db.budget.findMany({
      where: { userId },
    });

    // 3. Fetch goals
    const goals = await db.savingsGoal.findMany({
      where: { userId },
    });

    // Date references
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Calculate total net worth (all-time income - expense)
    const allIncome = transactions.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
    const allExpense = transactions.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const netWorth = allIncome - allExpense;

    // Monthly Income & Expenses (Current Month)
    const curMonthTxs = transactions.filter(t => t.date >= startOfMonth);
    const monthlyIncome = curMonthTxs.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = curMonthTxs.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Monthly Income & Expenses (Previous Month)
    const prevMonthTxs = transactions.filter(t => t.date >= startOfPrevMonth && t.date <= endOfPrevMonth);
    const prevMonthlyIncome = prevMonthTxs.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
    const prevMonthlyExpenses = prevMonthTxs.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Percentage changes
    const incomeChange = prevMonthlyIncome > 0 ? ((monthlyIncome - prevMonthlyIncome) / prevMonthlyIncome) * 100 : 0;
    const expenseChange = prevMonthlyExpenses > 0 ? ((monthlyExpenses - prevMonthlyExpenses) / prevMonthlyExpenses) * 100 : 0;

    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

    // Format recent transactions
    const formattedRecent = await Promise.all(
      transactions.slice(0, 5).map(async (tx) => {
        let categoryName = "Other";
        if (tx.categoryId) {
          const cat = await db.category.findUnique({ where: { id: tx.categoryId } });
          categoryName = cat?.name || "Other";
        }
        return {
          id: tx.id,
          description: tx.description,
          amount: tx.type === "EXPENSE" ? -Math.abs(tx.amount) : tx.amount,
          category: categoryName,
          date: tx.date,
          type: tx.type.toLowerCase(),
        };
      })
    );

    // Format budgets
    const formattedBudgets = await Promise.all(
      budgets.slice(0, 4).map(async (b) => {
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
        return {
          name: b.name,
          spent,
          limit: b.amount,
        };
      })
    );

    // Format goals
    const formattedGoals = goals.slice(0, 3).map((g) => ({
      name: g.name,
      current: g.currentAmount,
      target: g.targetAmount,
      icon: g.icon,
      color: g.color,
    }));

    return NextResponse.json({
      stats: {
        netWorth,
        monthlyIncome,
        monthlyExpenses,
        savingsRate,
        incomeChange,
        expenseChange,
      },
      recentTransactions: formattedRecent,
      budgets: formattedBudgets,
      goals: formattedGoals,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
