import { Link } from 'react-router-dom'
import type { Transaction } from '../../types/finance'
import { TransactionTable } from '../transactions/TransactionTable'

interface RecentTransactionsProps {
  transactions: Transaction[]
  loading?: boolean
}

/** Tabel transaksi terbaru pada dashboard overview. */
export function RecentTransactions({ transactions, loading = false }: RecentTransactionsProps) {
  const visible = transactions.slice(0, 6)

  return (
    <article className="card panel full">
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Transaksi terbaru</h2>
          <p className="panel-sub">Aktivitas keuangan bulan ini</p>
        </div>
        <div className="panel-actions">
          <Link className="ghost" to="/transaksi">
            Lihat semua
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="loading-block" aria-hidden="true">
          <div className="skeleton" style={{ width: '70%' }} />
          <div className="skeleton" style={{ width: '90%' }} />
          <div className="skeleton" style={{ width: '80%' }} />
        </div>
      ) : (
        <TransactionTable
          transactions={visible}
          emptyTitle="Belum ada transaksi bulan ini."
          emptyDescription="Transaksi yang kamu tambahkan akan muncul di sini."
        />
      )}
    </article>
  )
}
