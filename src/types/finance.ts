/**
 * Tipe domain untuk domain keuangan Arif Finance.
 *
 * Semua tipe di file ini adalah "kontrak" bersama antara mock service dan
 * HTTP service (lihat `src/services/`), sehingga pergantian sumber data
 * tidak mengubah bentuk data yang dipakai komponen UI.
 */

export type TransactionType = 'income' | 'expense'

/** Sumber transaksi. `gmail` akan dipakai saat integrasi email benar-benar aktif. */
export type TransactionSource = 'manual' | 'gmail' | 'qris' | 'bank'

export interface Transaction {
  id: string
  name: string
  category: string
  type: TransactionType
  /** Nominal dalam Rupiah penuh (bukan dalam ribuan). */
  amount: number
  /** Tanggal transaksi format ISO `YYYY-MM-DD`. */
  date: string
  source: TransactionSource
  account?: string
  note?: string
}

export interface CreateTransactionInput {
  name: string
  category: string
  type: TransactionType
  amount: number
  /** Default: hari ini. */
  date?: string
  note?: string
}

export interface UpdateTransactionInput {
  name?: string
  category?: string
  type?: TransactionType
  amount?: number
  date?: string
  note?: string
}

export interface TransactionQuery {
  /** Periode `YYYY-MM`. Kosong = semua periode. */
  period?: string
  /** `all` = tanpa filter tipe. */
  type?: TransactionType | 'all'
  category?: string
  search?: string
}

export type BudgetColor = 'green' | 'blue' | 'orange' | 'red'

export interface Budget {
  id: string
  name: string
  /** Batas anggaran. */
  limit: number
  /** Realisasi pengeluaran pada periode berjalan. */
  spent: number
  color: BudgetColor
}

export interface SavingsGoal {
  id: string
  name: string
  target: number
  saved: number
  /** Tanggal target (ISO `YYYY-MM-DD`). */
  deadline?: string
  note?: string
}

export interface CashflowPoint {
  /** Periode `YYYY-MM`. */
  period: string
  /** Label ringkas untuk chart, contoh: `Okt`. */
  label: string
  income: number
  expense: number
}

export interface PeriodOption {
  value: string
  label: string
}

/** Status sinkronisasi backend. `mode: 'mock'` dipakai sampai ada API sungguhan. */
export interface SyncStatus {
  mode: 'mock' | 'live'
  connected: boolean
  gmailConnected: boolean
  lastSyncAt: string | null
  message: string
}

export interface MonthlySummary {
  period: string
  income: number
  expense: number
  /** Persentase perubahan dibanding periode sebelumnya. */
  incomeChange: number
  expenseChange: number
}
