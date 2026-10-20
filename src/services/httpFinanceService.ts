/**
 * Implementasi `FinanceService` di atas REST API.
 *
 * Belum dipakai pada default build (frontend memakai mock), tetapi sudah
 * mengikuti kontrak yang sama sehingga cukup mengubah `VITE_DATA_SOURCE=http`.
 * Bentuk endpoint didokumentasikan di README.md.
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
import { request } from './apiClient'
import type { FinanceService } from './financeService'

export const httpFinanceService: FinanceService = {
  async listTransactions(query: TransactionQuery = {}): Promise<Transaction[]> {
    const data = await request<Transaction[]>('/transactions', {
      query: {
        period: query.period,
        type: query.type === 'all' ? undefined : query.type,
        category: query.category,
        search: query.search,
      },
    })
    return data ?? []
  },

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    return request<Transaction>('/transactions', { method: 'POST', body: input })
  },

  async updateTransaction(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    return request<Transaction>(`/transactions/${id}`, { method: 'PATCH', body: input })
  },

  async deleteTransaction(id: string): Promise<void> {
    await request<void>(`/transactions/${id}`, { method: 'DELETE' })
  },

  async getBudgets(period: string): Promise<Budget[]> {
    const data = await request<Budget[]>('/budgets', { query: { period } })
    return data ?? []
  },

  async getGoals(): Promise<SavingsGoal[]> {
    const data = await request<SavingsGoal[]>('/goals')
    return data ?? []
  },

  async getCashflow(months = 6): Promise<CashflowPoint[]> {
    const data = await request<CashflowPoint[]>('/cashflow', { query: { months } })
    return data ?? []
  },

  async getBalance(): Promise<number> {
    const data = await request<{ balance: number }>('/balance')
    return data?.balance ?? 0
  },

  async getSyncStatus(): Promise<SyncStatus> {
    return request<SyncStatus>('/sync/status')
  },
}
