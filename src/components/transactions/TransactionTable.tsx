import { accountLabel } from '../../data/mockData'
import type { Transaction } from '../../types/finance'
import { formatDate, formatRupiah } from '../../utils/format'
import { EmptyState } from '../ui/EmptyState'
import { StatusPill } from '../ui/StatusPill'

interface TransactionTableProps {
  transactions: Transaction[]
  /** Tampilkan kolom sumber & tombol hapus. */
  detailed?: boolean
  onDelete?: (id: string) => void
  /** Aturan apakah sebuah transaksi boleh dihapus. */
  canDelete?: (transaction: Transaction) => boolean
  emptyTitle?: string
  emptyDescription?: string
}

/** Tabel transaksi yang bisa dipakai ulang di overview dan halaman transaksi. */
export function TransactionTable({
  transactions,
  detailed = false,
  onDelete,
  canDelete,
  emptyTitle = 'Belum ada transaksi.',
  emptyDescription = 'Tambahkan transaksi pertamamu lewat tombol "Tambah transaksi".',
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="empty">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    )
  }

  return (
    <div className="table-scroll">
      <table className="table">
        <thead>
          <tr>
            <th>Transaksi</th>
            <th>Kategori</th>
            <th>Tanggal</th>
            {detailed ? <th>Sumber</th> : null}
            <th>Tipe</th>
            <th style={{ textAlign: 'right' }}>Nominal</th>
            {detailed && onDelete ? <th aria-label="Aksi" /> : null}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const deletable = Boolean(onDelete) && (canDelete ? canDelete(transaction) : true)
            return (
            <tr key={transaction.id}>
              <td>
                <div className="tx-cell">
                  <div className={`tx-icon ${transaction.type}`} aria-hidden="true">
                    {transaction.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="tx-main">
                    <strong>{transaction.name}</strong>
                    <span>{transaction.note ?? accountLabel(transaction)}</span>
                  </div>
                </div>
              </td>
              <td>{transaction.category}</td>
              <td>{formatDate(transaction.date)}</td>
              {detailed ? <td>{accountLabel(transaction)}</td> : null}
              <td>
                <StatusPill type={transaction.type} />
              </td>
              <td className={`amount ${transaction.type}`} style={{ textAlign: 'right' }}>
                {transaction.type === 'income' ? '+' : '−'} {formatRupiah(transaction.amount)}
              </td>
              {detailed && onDelete && deletable ? (
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="ghost"
                    style={{ padding: '6px 10px', fontSize: 12 }}
                    onClick={() => onDelete(transaction.id)}
                    aria-label={`Hapus transaksi ${transaction.name}`}
                  >
                    Hapus
                  </button>
                </td>
              ) : null}
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
