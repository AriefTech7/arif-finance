import { formatPercent, formatRupiah } from '../../utils/format'

export interface StatItem {
  id: string
  label: string
  value: number
  icon: string
  tone: 'green' | 'blue' | 'orange' | 'red'
  trend: string
  trendTone: 'up' | 'down' | 'neutral'
}

interface StatCardsProps {
  balance: number
  income: number
  expense: number
  remainingBudget: number
  /** Persentase perubahan dibanding periode sebelumnya, `null` bila tidak tersedia. */
  incomeChange: number | null
  expenseChange: number | null
}

function changeLabel(value: number | null, direction: 'up' | 'down'): { text: string; tone: 'up' | 'down' | 'neutral' } {
  if (value === null) {
    return { text: 'Data bulan lalu tidak tersedia', tone: 'neutral' }
  }
  return {
    text: `${formatPercent(value, true)} dari bulan lalu`,
    tone: direction === 'up' ? (value >= 0 ? 'up' : 'down') : value <= 0 ? 'up' : 'down',
  }
}

/** Empat kartu ringkasan: saldo, pemasukan, pengeluaran, sisa anggaran. */
export function StatCards({
  balance,
  income,
  expense,
  remainingBudget,
  incomeChange,
  expenseChange,
}: StatCardsProps) {
  const incomeTrend = changeLabel(incomeChange, 'up')
  const expenseTrend = changeLabel(expenseChange, 'down')

  const items: StatItem[] = [
    {
      id: 'balance',
      label: 'Total saldo',
      value: balance,
      icon: 'Rp',
      tone: 'green',
      trend: 'Gabungan seluruh rekening',
      trendTone: 'neutral',
    },
    {
      id: 'income',
      label: 'Pemasukan',
      value: income,
      icon: '↙',
      tone: 'blue',
      trend: incomeTrend.text,
      trendTone: incomeTrend.tone,
    },
    {
      id: 'expense',
      label: 'Pengeluaran',
      value: expense,
      icon: '↗',
      tone: 'orange',
      trend: expenseTrend.text,
      trendTone: expenseTrend.tone,
    },
    {
      id: 'remaining',
      label: 'Sisa anggaran',
      value: remainingBudget,
      icon: '◒',
      tone: 'red',
      trend: 'Sisa pagu bulan ini',
      trendTone: 'neutral',
    },
  ]

  return (
    <section className="stats" aria-label="Ringkasan keuangan">
      {items.map((item) => (
        <article className="card stat" key={item.id}>
          <div className="stat-top">
            <span>{item.label}</span>
            <div className={`stat-icon ${item.tone}`} aria-hidden="true">
              {item.icon}
            </div>
          </div>
          <h2 className="stat-value">{formatRupiah(item.value)}</h2>
          <span className={`trend ${item.trendTone}`}>{item.trend}</span>
        </article>
      ))}
    </section>
  )
}
