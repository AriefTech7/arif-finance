/**
 * Kontrak service boundary untuk data keuangan.
 *
 * Seluruh komponen UI hanya boleh bergantung pada interface `FinanceService`.
 * Saat ini implementasi aktif adalah `mockFinanceService` (data lokal),
 * sedangkan `httpFinanceService` sudah disiapkan untuk API sungguhan.
 */

import type {
  Budget,
  CashflowPoint,
  CreateTransactionInput,
  SavingsGoal,
  SyncStatus,
  Transaction,
  TransactionQuery,
  UpdateTransactionInput,
} from '../types/finance'

export interface FinanceService {
  /** Daftar transaksi, opsional difilter periode/tipe/kategori/pencarian. */
  listTransactions(query?: TransactionQuery): Promise<Transaction[]>
  createTransaction(input: CreateTransactionInput): Promise<Transaction>
  updateTransaction(id: string, input: UpdateTransactionInput): Promise<Transaction>
  deleteTransaction(id: string): Promise<void>
  /** Ringkasan anggaran pada periode tertentu. */
  getBudgets(period: string): Promise<Budget[]>
  /** Daftar target tabungan. */
  getGoals(): Promise<SavingsGoal[]>
  /** Arus kas (pemasukan/pengeluaran) beberapa bulan terakhir. */
  getCashflow(months?: number): Promise<CashflowPoint[]>
  /** Saldo akhir seluruh rekening. */
  getBalance(): Promise<number>
  /** Status sinkronisasi (mock vs live). */
  getSyncStatus(): Promise<SyncStatus>
}
