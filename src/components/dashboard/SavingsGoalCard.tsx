import type { CSSProperties } from 'react'
import type { SavingsGoal } from '../../types/finance'
import { formatDate, formatRupiah } from '../../utils/format'
import { ProgressBar } from '../ui/ProgressBar'

interface SavingsGoalCardProps {
  goal: SavingsGoal
}

/** Kartu target tabungan dengan indikator progress berbentuk donat. */
export function SavingsGoalCard({ goal }: SavingsGoalCardProps) {
  const percent = goal.target > 0 ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0
  const remaining = Math.max(0, goal.target - goal.saved)
  const ringStyle = { '--progress': `${percent}%` } as CSSProperties

  return (
    <article className="card panel">
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Target tabungan</h2>
          <p className="panel-sub">Sedikit demi sedikit menjadi bukit</p>
        </div>
      </div>

      <div className="goal">
        <div className="goal-ring" style={ringStyle}>
          <span>{percent}%</span>
        </div>
        <div className="goal-info">
          <h3>{goal.name}</h3>
          <p>
            {formatRupiah(goal.saved)} dari target {formatRupiah(goal.target)}
          </p>
          <div className="goal-bar">
            <ProgressBar value={percent} label={`${goal.name} ${percent}%`} />
          </div>
          <p style={{ marginTop: 8 }}>
            Kurang {formatRupiah(remaining)}
            {goal.deadline ? ` · target ${formatDate(goal.deadline)}` : ''}
          </p>
        </div>
      </div>
    </article>
  )
}
