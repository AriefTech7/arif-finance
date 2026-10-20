/**
 * State global (konteks React) untuk data keuangan.
 *
 * Provider ini satu-satunya tempat yang memanggil `financeService`.
 * Komponen UI cukup memakai `useFinance()` untuk membaca data dan aksi.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { financeService } from '../services'
import type {
  Budget,
  CashflowPoint,
  CreateTransactionInput,
  SavingsGoal,
  SyncStatus,
  Transaction,
} from '../types/finance'
import { recentPeriods } from '../utils/format'

interface FinanceContextValue {
  /** Periode aktif format `YYYY-MM`. */
  period: string
  /** Opsi periode yang bisa dipilih (6 bulan terakhir). */
  periodOptions: string[]
  transactions: Transaction[]
  budgets: Budget[]
  goals: SavingsGoal[]
  cashflow: CashflowPoint[]
  balance: number
  syncStatus: SyncStatus | null
  loading: boolean
  saving: boolean
  error: string | null
  setPeriod: (period: string) => void
  addTransaction: (input: CreateTransactionInput) => Promise<Transaction>
  deleteTransaction: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

const FinanceContext = createContext<FinanceContextValue | null>(null)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [period, setPeriodState] = useState(() => recentPeriods(6)[0])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [cashflow, setCashflow] = useState<CashflowPoint[]>([])
  const [balance, setBalance] = useState(0)
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (activePeriod: string) => {
    setLoading(true)
    setError(null)
    try {
      const [tx, budgetList, goalList, flow, currentBalance, status] = await Promise.all([
        financeService.listTransactions({ period: activePeriod }),
        financeService.getBudgets(activePeriod),
        financeService.getGoals(),
        financeService.getCashflow(6),
        financeService.getBalance(),
        financeService.getSyncStatus(),
      ])
      setTransactions(tx)
      setBudgets(budgetList)
      setGoals(goalList)
      setCashflow(flow)
      setBalance(currentBalance)
      setSyncStatus(status)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Gagal memuat data keuangan.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load(period)
  }, [load, period])

  const setPeriod = useCallback((next: string) => {
    setPeriodState(next)
  }, [])

  const addTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      setSaving(true)
      try {
        const created = await financeService.createTransaction(input)
        await load(period)
        return created
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : 'Gagal menyimpan transaksi.'
        setError(message)
        throw caught instanceof Error ? caught : new Error(message)
      } finally {
        setSaving(false)
      }
    },
    [load, period],
  )

  const deleteTransaction = useCallback(
    async (id: string) => {
      setSaving(true)
      try {
        await financeService.deleteTransaction(id)
        await load(period)
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : 'Gagal menghapus transaksi.'
        setError(message)
        throw caught instanceof Error ? caught : new Error(message)
      } finally {
        setSaving(false)
      }
    },
    [load, period],
  )

  const refresh = useCallback(async () => {
    await load(period)
  }, [load, period])

  const value = useMemo<FinanceContextValue>(
    () => ({
      period,
      periodOptions: recentPeriods(6),
      transactions,
      budgets,
      goals,
      cashflow,
      balance,
      syncStatus,
      loading,
      saving,
      error,
      setPeriod,
      addTransaction,
      deleteTransaction,
      refresh,
    }),
    [
      addTransaction,
      balance,
      budgets,
      cashflow,
      deleteTransaction,
      error,
      goals,
      loading,
      period,
      refresh,
      saving,
      setPeriod,
      syncStatus,
      transactions,
    ],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance(): FinanceContextValue {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance harus dipakai di dalam <FinanceProvider>.')
  }
  return context
}
