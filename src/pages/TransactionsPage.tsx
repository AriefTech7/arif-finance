import { useMemo, useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { TransactionFilters } from '../components/transactions/TransactionFilters'
import type { TransactionFiltersState } from '../components/transactions/TransactionFilters'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { formatPeriod, formatRupiah } from '../utils/format'

const INITIAL_FILTERS: TransactionFiltersState = { search: '', type: 'all', category: 'all' }

/** Halaman transaksi: tabel lengkap dengan pencarian, filter, ekspor, dan hapus. */
export function TransactionsPage() {
  const { transactions, period, deleteTransaction } = useFinance()
  const [filters, setFilters] = useState<TransactionFiltersState>(INITIAL_FILTERS)

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((transaction) => transaction.category))).sort(),
    [transactions],
  )

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    return transactions.filter((transaction) => {
      if (filters.type !== 'all' && transaction.type !== filters.type) return false
      if (filters.category !== 'all' && transaction.category !== filters.category) return false
      if (!search) return true
      const haystack = `${transaction.name} ${transaction.category} ${transaction.note ?? ''}`.toLowerCase()
      return haystack.includes(search)
    })
  }, [filters, transactions])

  const totals = useMemo(
    () => ({
      income: filtered
        .filter((transaction) => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0),
      expense: filtered
        .filter((transaction) => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0),
    }),
    [filtered],
  )

  function exportCsv() {
    const header = ['Nama', 'Kategori', 'Tanggal', 'Tipe', 'Nominal']
    const rows = filtered.map((transaction) =>
      [
        transaction.name,
        transaction.category,
        transaction.date,
        transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        String(transaction.amount),
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(','),
    )
    const csv = [header.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `arif-finance-transaksi-${period}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="stack">
      <section className="card page-card">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Semua transaksi</h2>
            <p className="panel-sub">Periode {formatPeriod(period)} · data lokal (mock)</p>
          </div>
          <div className="panel-actions">
            <button type="button" className="ghost" onClick={exportCsv} disabled={filtered.length === 0}>
              Export CSV
            </button>
          </div>
        </div>

        <TransactionFilters
          value={filters}
          categories={categories}
          resultCount={filtered.length}
          onChange={setFilters}
          onReset={() => setFilters(INITIAL_FILTERS)}
        />

        <TransactionTable
          transactions={filtered}
          detailed
          canDelete={(transaction) => !transaction.id.startsWith('seed-')}
          onDelete={(id) => {
            void deleteTransaction(id)
          }}
          emptyTitle="Tidak ada transaksi yang cocok."
          emptyDescription="Ubah kata kunci atau reset filter untuk melihat transaksi lain."
        />
      </section>

      <section className="card page-card">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Ringkasan hasil filter</h2>
            <p className="panel-sub">Total dari {filtered.length} transaksi terpilih</p>
          </div>
        </div>
        <div className="stats" style={{ marginBottom: 0 }}>
          <article className="card stat">
            <div className="stat-top">
              <span>Pemasukan</span>
              <div className="stat-icon blue" aria-hidden="true">
                ↙
              </div>
            </div>
            <h2 className="stat-value">{formatRupiah(totals.income)}</h2>
          </article>
          <article className="card stat">
            <div className="stat-top">
              <span>Pengeluaran</span>
              <div className="stat-icon orange" aria-hidden="true">
                ↗
              </div>
            </div>
            <h2 className="stat-value">{formatRupiah(totals.expense)}</h2>
          </article>
          <article className="card stat">
            <div className="stat-top">
              <span>Selisih</span>
              <div className="stat-icon green" aria-hidden="true">
                ◒
              </div>
            </div>
            <h2 className="stat-value">{formatRupiah(totals.income - totals.expense)}</h2>
          </article>
        </div>
      </section>
    </div>
  )
}
