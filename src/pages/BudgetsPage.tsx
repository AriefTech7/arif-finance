import { useFinance } from '../context/FinanceContext'
import { ProgressBar } from '../components/ui/ProgressBar'
import { formatPeriod, formatRupiah } from '../utils/format'

/** Halaman anggaran: rincian pagu vs realisasi per kategori. */
export function BudgetsPage() {
  const { budgets, period } = useFinance()

  const totalLimit = budgets.reduce((total, budget) => total + budget.limit, 0)
  const totalSpent = budgets.reduce((total, budget) => total + budget.spent, 0)
  const remaining = Math.max(0, totalLimit - totalSpent)
  const percent = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0

  return (
    <div className="stack">
      <section className="card page-card">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Pagu anggaran {formatPeriod(period)}</h2>
            <p className="panel-sub">Realisasi dihitung otomatis dari transaksi pada periode berjalan</p>
          </div>
          <span className="pill mock">Data contoh (mock)</span>
        </div>

        <div className="budget-summary">
          <span className="note">
            Terpakai {formatRupiah(totalSpent)} dari {formatRupiah(totalLimit)} ({percent}%)
          </span>
          <strong>Sisa {formatRupiah(remaining)}</strong>
        </div>

        <div className="list-rows" style={{ marginTop: 16 }}>
          {budgets.map((budget) => {
            const ratio = budget.limit > 0 ? budget.spent / budget.limit : 0
            const percentUsed = Math.min(100, Math.round(ratio * 100))
            const color = ratio >= 1 ? 'red' : ratio >= 0.85 ? 'orange' : budget.color
            return (
              <div className="list-row" key={budget.id} style={{ display: 'block' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <strong>{budget.name}</strong>
                  <span>
                    {formatRupiah(budget.spent)} / {formatRupiah(budget.limit)} · {percentUsed}%
                  </span>
                </div>
                <ProgressBar value={percentUsed} color={color} label={`${budget.name} ${percentUsed}%`} />
              </div>
            )
          })}
        </div>
      </section>

      <section className="card page-card">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Catatan anggaran</h2>
            <p className="panel-sub">Batas anggaran masih berupa template demo</p>
          </div>
        </div>
        <p className="note">
          Pagu anggaran (kebutuhan, keinginan, transportasi) saat ini berasal dari data contoh yang statis.
          Membuat dan mengubah pagu akan tersedia setelah service backend dan penyimpanan database tersedia.
          Sementara itu, realisasi tetap dihitung dari transaksi yang kamu tambahkan lewat modal.
        </p>
      </section>
    </div>
  )
}
