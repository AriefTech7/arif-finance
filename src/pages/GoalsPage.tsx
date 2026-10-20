import { useState } from 'react'
import type { CSSProperties } from 'react'
import { useFinance } from '../context/FinanceContext'
import { ProgressBar } from '../components/ui/ProgressBar'
import { formatDate, formatRupiah } from '../utils/format'

/** Halaman target tabungan. */
export function GoalsPage() {
  const { goals } = useFinance()
  const [simulated, setSimulated] = useState<Record<string, number>>({})

  return (
    <div className="stack">
      {goals.map((goal) => {
        const saved = goal.saved + (simulated[goal.id] ?? 0)
        const percent = goal.target > 0 ? Math.min(100, Math.round((saved / goal.target) * 100)) : 0
        const ringStyle = { '--progress': `${percent}%` } as CSSProperties
        return (
          <section className="card page-card" key={goal.id}>
            <div className="panel-head">
              <div>
                <h2 className="panel-title">{goal.name}</h2>
                <p className="panel-sub">
                  {goal.deadline ? `Target ${formatDate(goal.deadline)}` : 'Tanpa tenggat'}
                  {goal.note ? ` · ${goal.note}` : ''}
                </p>
              </div>
              <span className="pill mock">Simulasi lokal</span>
            </div>

            <div className="goal">
              <div className="goal-ring" style={ringStyle}>
                <span>{percent}%</span>
              </div>
              <div className="goal-info" style={{ flex: 1 }}>
                <h3>
                  {formatRupiah(saved)} dari {formatRupiah(goal.target)}
                </h3>
                <p>Kurang {formatRupiah(Math.max(0, goal.target - saved))}</p>
                <div className="goal-bar" style={{ maxWidth: '100%', marginTop: 10 }}>
                  <ProgressBar value={percent} label={`${goal.name} ${percent}%`} />
                </div>
              </div>
            </div>

            <div className="panel-actions" style={{ justifyContent: 'flex-start', marginTop: 16 }}>
              <button
                type="button"
                className="ghost"
                onClick={() => setSimulated((prev) => ({ ...prev, [goal.id]: (prev[goal.id] ?? 0) + 500_000 }))}
              >
                + Tambah tabungan (simulasi Rp500.000)
              </button>
              {simulated[goal.id] ? (
                <button
                  type="button"
                  className="ghost"
                  onClick={() =>
                    setSimulated((prev) => {
                      const next = { ...prev }
                      delete next[goal.id]
                      return next
                    })
                  }
                >
                  Reset simulasi
                </button>
              ) : null}
            </div>
          </section>
        )
      })}

      <section className="card page-card">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Tentang target tabungan</h2>
            <p className="panel-sub">Status: mode demo</p>
          </div>
        </div>
        <p className="note">
          Nilai tabungan masih berupa data contoh. Tombol "Tambah tabungan" hanya simulasi di sisi browser dan
          akan hilang setelah data target disimpan di backend.
        </p>
      </section>
    </div>
  )
}
