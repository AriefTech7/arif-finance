import type { TransactionType } from '../../types/finance'

interface StatusPillProps {
  type: TransactionType
  children?: string
}

/** Pill status pemasukan/pengeluaran. */
export function StatusPill({ type, children }: StatusPillProps) {
  return <span className={`pill ${type}`}>{children ?? (type === 'income' ? 'Pemasukan' : 'Pengeluaran')}</span>
}
