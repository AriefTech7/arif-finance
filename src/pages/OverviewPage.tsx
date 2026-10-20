import { useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import { BudgetPanel } from '../components/dashboard/BudgetPanel'
import { CashflowChart } from '../components/dashboard/CashflowChart'
import { QuickActions } from '../components/dashboard/QuickActions'
import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import { SavingsGoalCard } from '../components/dashboard/SavingsGoalCard'
import { StatCards } from '../components/dashboard/StatCards'
import { SyncStatusCard } from '../components/dashboard/SyncStatusCard'
import { changePercent, formatPeriod, shiftPeriod } from '../utils/format'

/** Halaman utama: ringkasan keuangan bulanan. */
export function OverviewPage() {
  const { transactions, budgets, goals, cashflow, balance, syncStatus, loading, period } = useFinance()

  const summary = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0)
    const expense = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0)
    return { income, expense }
  }, [transactions])

  const comparison = useMemo(() => {
    const previousPeriod = shiftPeriod(period, -1)
    const previousPoint = cashflow.find((item) => item.period === previousPeriod)
    const currentPoint = cashflow.find((item) => item.period === period)

    if (!previousPoint) {
      return { incomeChange: null, expenseChange: null }
    }

    return {
      incomeChange: changePercent(currentPoint?.income ?? summary.income, previousPoint.income),
      expenseChange: changePercent(currentPoint?.expense ?? summary.expense, previousPoint.expense),
    }
  }, [cashflow, period, summary.expense, summary.income])

  const totalLimit = budgets.reduce((total, budget) => total + budget.limit, 0)
  const totalSpent = budgets.reduce((total, budget) => total + budget.spent, 0)
  const remainingBudget = Math.max(0, totalLimit - totalSpent)

  return (
    <>
      <StatCards
        balance={balance}
        income={summary.income}
        expense={summary.expense}
        remainingBudget={remainingBudget}
        incomeChange={comparison.incomeChange}
        expenseChange={comparison.expenseChange}
      />

      <section className="grid">
        <div className="left-stack">
          <article className="card panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">Arus kas</h2>
                <p className="panel-sub">Pemasukan dan pengeluaran 6 bulan terakhir</p>
              </div>
            </div>
            <CashflowChart data={cashflow} />
          </article>

          <QuickActions />
        </div>

        <div className="right-stack">
          <SyncStatusCard status={syncStatus} />

          <BudgetPanel budgets={budgets} period={period} />

          {goals[0] ? <SavingsGoalCard goal={goals[0]} /> : null}
        </div>

        <RecentTransactions transactions={transactions} loading={loading} />
      </section>

      <p className="note" style={{ marginTop: 18 }}>
        Periode aktif: {formatPeriod(period)} · data contoh (mock) tanpa koneksi eksternal.
      </p>
    </>
  )
}
