import type { Budget } from '../../types/finance'
import { formatPeriod, formatRupiah } from '../../utils/format'
import { ProgressBar } from '../ui/ProgressBar'

interface BudgetPanelProps {
  budgets: Budget[]
  period: string
}

function colorFor(budget: Budget): 'green' | 'blue' | 'orange' | 'red' {
  const ratio = budget.limit > 0 ? budget.spent / budget.limit : 0
  if (ratio >= 1) return 'red'
  if (ratio >= 0.85) return 'orange'
  return budget.color
}

/** Panel anggaran bulan ini: realisasi vs pagu per kategori. */
export function BudgetPanel({ budgets, period }: BudgetPanelProps) {
  const totalLimit = budgets.reduce((total, budget) => total + budget.limit, 0)
  const totalSpent = budgets.reduce((total, budget) => total + budget.spent, 0)
  const percent = totalLimit > 0 ? Math.min(100, Math.round((totalSpent / totalLimit) * 100)) : 0

  return (
    <article className="card panel">
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Anggaran bulan ini</h2>
          <p className="panel-sub">{formatPeriod(period)}</p>
        </div>
        <strong>{percent}%</strong>
      </div>

      <div className="budget-summary">
        <span className="note">Total terpakai</span>
        <strong>
          {formatRupiah(totalSpent)} <span className="note">/ {formatRupiah(totalLimit)}</span>
        </strong>
      </div>

      {budgets.map((budget) => {
        const ratio = budget.limit > 0 ? budget.spent / budget.limit : 0
        const percentUsed = Math.min(100, Math.round(ratio * 100))
        return (
          <div className="budget-row" key={budget.id}>
            <div className="budget-label">
              <span>{budget.name}</span>
              <span>
                {formatRupiah(budget.spent)} / {formatRupiah(budget.limit)}
              </span>
            </div>
            <ProgressBar value={percentUsed} color={colorFor(budget)} label={`${budget.name} ${percentUsed}%`} />
          </div>
        )
      })}
    </article>
  )
}
