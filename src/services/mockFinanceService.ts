/**
 * Implementasi `FinanceService` berbasis data lokal (mock).
 *
 * - Data awal berasal dari `src/data/mockData.ts` (fiktif).
 * - Transaksi yang dibuat pengguna disimpan di `localStorage` browser.
 * - Tidak ada koneksi ke Gmail, bank, atau server mana pun.
 */

import {
  BUDGET_TEMPLATES,
  MOCK_SYNC_STATUS,
  OPENING_BALANCE,
  SAVINGS_GOALS,
  buildMockTransactions,
} from '../data/mockData'
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
import { monthLabel, recentPeriods, toISODate } from '../utils/format'
import { readJson, writeJson } from '../utils/storage'
import type { FinanceService } from './financeService'

const STORAGE_KEY = 'arif-finance.transactions.v1'

/** Jeda buatan supaya UI terlihat realistis saat memuat data. */
const LATENCY_MS = 180

function delay<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

function readStorage(): Transaction[] {
  const parsed = readJson<unknown>(STORAGE_KEY, [])
  if (!Array.isArray(parsed)) return []
  return parsed.filter((item): item is Transaction => {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Transaction).id === 'string' &&
      typeof (item as Transaction).name === 'string' &&
      typeof (item as Transaction).amount === 'number'
    )
  })
}

function writeStorage(value: Transaction[]): void {
  writeJson(STORAGE_KEY, value)
}

function createId(): string {
  return `tx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** Transaksi buatan pengguna (disimpan di localStorage). */
let userTransactions: Transaction[] | null = null

function getUserTransactions(): Transaction[] {
  if (userTransactions === null) userTransactions = readStorage()
  return userTransactions
}

function setUserTransactions(next: Transaction[]): void {
  userTransactions = next
  writeStorage(next)
}

function allTransactions(): Transaction[] {
  const seeds = buildMockTransactions()
  return [...getUserTransactions(), ...seeds].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : a.id.localeCompare(b.id),
  )
}

function matchesQuery(transaction: Transaction, query: TransactionQuery): boolean {
  if (query.period && !transaction.date.startsWith(query.period)) return false
  if (query.type && query.type !== 'all' && transaction.type !== query.type) return false
  if (query.category && query.category !== 'all' && transaction.category !== query.category) return false
  if (query.search) {
    const haystack = `${transaction.name} ${transaction.category} ${transaction.note ?? ''}`.toLowerCase()
    if (!haystack.includes(query.search.toLowerCase())) return false
  }
  return true
}

export const mockFinanceService: FinanceService = {
  async listTransactions(query: TransactionQuery = {}): Promise<Transaction[]> {
    const result = allTransactions().filter((transaction) => matchesQuery(transaction, query))
    return delay(result)
  },

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    const transaction: Transaction = {
      id: createId(),
      name: input.name.trim(),
      category: input.category,
      type: input.type,
      amount: Math.round(input.amount),
      date: input.date ?? toISODate(new Date()),
      source: 'manual',
      note: input.note?.trim() || undefined,
    }
    setUserTransactions([transaction, ...getUserTransactions()])
    return delay(transaction)
  },

  async updateTransaction(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const seeds = buildMockTransactions()
    const seed = seeds.find((item) => item.id === id)
    const current = seed ?? getUserTransactions().find((item) => item.id === id)
    if (!current) throw new Error('Transaksi tidak ditemukan.')

    const updated: Transaction = {
      ...current,
      ...input,
      name: input.name?.trim() ?? current.name,
      amount: input.amount === undefined ? current.amount : Math.round(input.amount),
    }

    if (!seed) {
      setUserTransactions(getUserTransactions().map((item) => (item.id === id ? updated : item)))
    }
    return delay(updated)
  },

  async deleteTransaction(id: string): Promise<void> {
    setUserTransactions(getUserTransactions().filter((item) => item.id !== id))
    return delay(undefined)
  },

  async getBudgets(period: string): Promise<Budget[]> {
    const transactions = allTransactions().filter((transaction) => transaction.date.startsWith(period))
    const budgets = BUDGET_TEMPLATES.map((template) => {
      const spent = transactions
        .filter(
          (transaction) =>
            transaction.type === 'expense' && template.categories.includes(transaction.category),
        )
        .reduce((total, transaction) => total + transaction.amount, 0)
      return {
        id: template.id,
        name: template.name,
        limit: template.limit,
        spent,
        color: template.color,
      }
    })
    return delay(budgets)
  },

  async getGoals(): Promise<SavingsGoal[]> {
    return delay(SAVINGS_GOALS)
  },

  async getCashflow(months = 6): Promise<CashflowPoint[]> {
    const transactions = allTransactions()
    const periods = recentPeriods(months).reverse()
    const points = periods.map((period) => {
      const scoped = transactions.filter((transaction) => transaction.date.startsWith(period))
      return {
        period,
        label: monthLabel(period),
        income: scoped
          .filter((transaction) => transaction.type === 'income')
          .reduce((total, transaction) => total + transaction.amount, 0),
        expense: scoped
          .filter((transaction) => transaction.type === 'expense')
          .reduce((total, transaction) => total + transaction.amount, 0),
      }
    })
    return delay(points)
  },

  async getBalance(): Promise<number> {
    const transactions = allTransactions()
    const net = transactions.reduce(
      (total, transaction) => total + (transaction.type === 'income' ? transaction.amount : -transaction.amount),
      0,
    )
    return delay(OPENING_BALANCE + net)
  },

  async getSyncStatus(): Promise<SyncStatus> {
    return delay({ ...MOCK_SYNC_STATUS })
  },
}

/** Helper untuk testing: reset state mock (localStorage + cache). */
export function __resetMockService(): void {
  userTransactions = null
  writeStorage([])
}
