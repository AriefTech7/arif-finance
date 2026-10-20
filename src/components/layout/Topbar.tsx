import { useFinance } from '../../context/FinanceContext'
import { formatPeriod } from '../../utils/format'
import { useTransactionModal } from '../../context/TransactionModalContext'

interface TopbarProps {
  title: string
  eyebrow?: string
  onOpenMenu: () => void
}

/** Header halaman: judul, pemilih periode, dan aksi tambah transaksi. */
export function Topbar({ title, eyebrow = 'Selamat datang kembali, Arif', onOpenMenu }: TopbarProps) {
  const { period, setPeriod, periodOptions } = useFinance()
  const { openTransactionModal } = useTransactionModal()

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" className="menu-toggle" onClick={onOpenMenu} aria-label="Buka menu navigasi">
          ☰
        </button>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="title">{title}</h1>
        </div>
      </div>

      <div className="top-actions">
        <select
          className="month-select"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          aria-label="Pilih periode bulan"
        >
          {periodOptions.map((option) => (
            <option key={option} value={option}>
              {formatPeriod(option)}
            </option>
          ))}
        </select>
        <button type="button" className="primary" onClick={() => openTransactionModal('expense')}>
          + Tambah transaksi
        </button>
      </div>
    </header>
  )
}
