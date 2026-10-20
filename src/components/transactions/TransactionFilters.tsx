import type { TransactionType } from '../../types/finance'

export interface TransactionFiltersState {
  search: string
  type: TransactionType | 'all'
  category: string
}

interface TransactionFiltersProps {
  value: TransactionFiltersState
  categories: string[]
  resultCount: number
  onChange: (next: TransactionFiltersState) => void
  onReset: () => void
}

const TYPE_OPTIONS: Array<{ value: TransactionType | 'all'; label: string }> = [
  { value: 'all', label: 'Semua' },
  { value: 'expense', label: 'Pengeluaran' },
  { value: 'income', label: 'Pemasukan' },
]

/** Baris filter (pencarian, tipe, kategori) untuk tabel transaksi. */
export function TransactionFilters({
  value,
  categories,
  resultCount,
  onChange,
  onReset,
}: TransactionFiltersProps) {
  return (
    <div className="filters">
      <div className="filter-group">
        <input
          className="search"
          type="search"
          value={value.search}
          placeholder="Cari transaksi..."
          aria-label="Cari transaksi"
          onChange={(event) => onChange({ ...value, search: event.target.value })}
        />

        <div className="filter-group" role="group" aria-label="Filter tipe transaksi">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`chip${value.type === option.value ? ' active' : ''}`}
              aria-pressed={value.type === option.value}
              onClick={() => onChange({ ...value, type: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>

        <select
          className="select"
          style={{ width: 'auto' }}
          value={value.category}
          aria-label="Filter kategori"
          onChange={(event) => onChange({ ...value, category: event.target.value })}
        >
          <option value="all">Semua kategori</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <span className="result-count">
        {resultCount} transaksi ditemukan
        {value.search || value.type !== 'all' || value.category !== 'all' ? (
          <button
            type="button"
            className="ghost"
            style={{ padding: '5px 10px', fontSize: 12, marginLeft: 10 }}
            onClick={onReset}
          >
            Reset filter
          </button>
        ) : null}
      </span>
    </div>
  )
}
