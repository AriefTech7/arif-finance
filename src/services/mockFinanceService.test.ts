import { beforeEach, describe, expect, it } from 'vitest'
import { __resetMockService, mockFinanceService } from './mockFinanceService'
import { toPeriod } from '../utils/format'

const CURRENT_PERIOD = toPeriod(new Date())

beforeEach(() => {
  __resetMockService()
})

describe('mockFinanceService', () => {
  it('menyediakan transaksi contoh pada periode berjalan', async () => {
    const transactions = await mockFinanceService.listTransactions({ period: CURRENT_PERIOD })
    expect(transactions.length).toBeGreaterThan(0)
    expect(transactions.every((transaction) => transaction.date.startsWith(CURRENT_PERIOD))).toBe(true)
  })

  it('menyaring transaksi berdasarkan tipe dan pencarian', async () => {
    const income = await mockFinanceService.listTransactions({ period: CURRENT_PERIOD, type: 'income' })
    expect(income.length).toBeGreaterThan(0)
    expect(income.every((transaction) => transaction.type === 'income')).toBe(true)

    const search = await mockFinanceService.listTransactions({ period: CURRENT_PERIOD, search: 'gaji' })
    expect(search.every((transaction) => transaction.name.toLowerCase().includes('gaji'))).toBe(true)
  })

  it('menyimpan transaksi baru ke localStorage', async () => {
    const created = await mockFinanceService.createTransaction({
      name: 'Uji coba makan',
      category: 'Makanan',
      type: 'expense',
      amount: 25000,
      date: `${CURRENT_PERIOD}-15`,
    })

    expect(created.name).toBe('Uji coba makan')
    expect(created.source).toBe('manual')

    const stored = localStorage.getItem('arif-finance.transactions.v1')
    expect(stored).toContain('Uji coba makan')

    const transactions = await mockFinanceService.listTransactions({ period: CURRENT_PERIOD })
    expect(transactions.some((transaction) => transaction.id === created.id)).toBe(true)
  })

  it('menghapus transaksi buatan pengguna', async () => {
    const created = await mockFinanceService.createTransaction({
      name: 'Transaksi sementara',
      category: 'Lainnya',
      type: 'expense',
      amount: 10000,
      date: `${CURRENT_PERIOD}-10`,
    })

    await mockFinanceService.deleteTransaction(created.id)

    const transactions = await mockFinanceService.listTransactions({ period: CURRENT_PERIOD })
    expect(transactions.some((transaction) => transaction.id === created.id)).toBe(false)
  })

  it('menghitung anggaran dari transaksi pada periode berjalan', async () => {
    const budgets = await mockFinanceService.getBudgets(CURRENT_PERIOD)
    expect(budgets).toHaveLength(3)
    expect(budgets.every((budget) => budget.spent >= 0)).toBe(true)
    expect(budgets.reduce((total, budget) => total + budget.limit, 0)).toBe(3_700_000)
  })

  it('menyediakan arus kas 6 bulan', async () => {
    const cashflow = await mockFinanceService.getCashflow(6)
    expect(cashflow).toHaveLength(6)
    expect(cashflow[cashflow.length - 1].period).toBe(CURRENT_PERIOD)
  })

  it('menandai status sinkronisasi sebagai mock', async () => {
    const status = await mockFinanceService.getSyncStatus()
    expect(status.mode).toBe('mock')
    expect(status.connected).toBe(false)
    expect(status.gmailConnected).toBe(false)
  })
})
