/**
 * Data contoh (mock) untuk Arif Finance.
 *
 * Seluruh data di sini dibuat secara deterministik relatif terhadap tanggal
 * hari ini supaya dashboard selalu tampil "hidup" tanpa backend.
 * Angka-angka ini fiktif dan hanya untuk keperluan demo antarmuka.
 */

import type { Budget, SavingsGoal, Transaction, TransactionSource, TransactionType } from '../types/finance'
import { toISODate, toPeriod } from '../utils/format'

/** Saldo awal Dompet Arif (dummy). */
export const OPENING_BALANCE = 6_800_000

export const CATEGORIES = [
  'Makanan',
  'Transportasi',
  'Belanja',
  'Tagihan',
  'Hiburan',
  'Kesehatan',
  'Gaji',
  'Pemasukan',
  'Lainnya',
] as const

export const INCOME_CATEGORIES = ['Gaji', 'Pemasukan'] as const

interface Seed {
  name: string
  category: string
  type: TransactionType
  amount: number
  /** Urutan bulan relatif terhadap bulan berjalan (0 = bulan ini, 1 = bulan lalu). */
  monthOffset: number
  day: number
  source?: TransactionSource
  account?: string
}

const CURRENT_MONTH_SEEDS: Seed[] = [
  // Pemasukan
  { name: 'Gaji karyawan PT Contoh', category: 'Gaji', type: 'income', amount: 8_500_000, monthOffset: 0, day: 1, source: 'bank', account: 'BCA Utama' },
  { name: 'Proyek freelance landing page', category: 'Pemasukan', type: 'income', amount: 3_500_000, monthOffset: 0, day: 19, source: 'manual' },
  { name: 'Bonus proyek bulanan', category: 'Pemasukan', type: 'income', amount: 750_000, monthOffset: 0, day: 12, source: 'manual' },

  // Kebutuhan: 1.250.000
  { name: 'Belanja bulanan|superindo', category: 'Makanan', type: 'expense', amount: 385_000, monthOffset: 0, day: 4, source: 'qris' },
  { name: 'Makan siang kantor', category: 'Makanan', type: 'expense', amount: 65_000, monthOffset: 0, day: 6, source: 'qris' },
  { name: 'Makan malam keluarga', category: 'Makanan', type: 'expense', amount: 42_000, monthOffset: 0, day: 11, source: 'qris' },
  { name: 'Kopi dan sarapan', category: 'Makanan', type: 'expense', amount: 35_000, monthOffset: 0, day: 15, source: 'qris' },
  { name: 'Kopi sore', category: 'Makanan', type: 'expense', amount: 18_000, monthOffset: 0, day: 17, source: 'qris' },
  { name: 'Tagihan internet', category: 'Tagihan', type: 'expense', amount: 275_000, monthOffset: 0, day: 18, source: 'bank', account: 'BCA Utama' },
  { name: 'Tagihan listrik PLN', category: 'Tagihan', type: 'expense', amount: 320_000, monthOffset: 0, day: 8, source: 'bank', account: 'BCA Utama' },
  { name: 'Obat dan vitamin', category: 'Kesehatan', type: 'expense', amount: 110_000, monthOffset: 0, day: 9, source: 'qris' },

  // Keinginan: 820.000
  { name: 'PT Graha KI (Karya Iswara)', category: 'Belanja', type: 'expense', amount: 340_000, monthOffset: 0, day: 20, source: 'qris' },
  { name: 'Aksesori keyboard mekanis', category: 'Belanja', type: 'expense', amount: 195_000, monthOffset: 0, day: 13, source: 'qris' },
  { name: 'Nonton film bioskop', category: 'Hiburan', type: 'expense', amount: 85_000, monthOffset: 0, day: 10, source: 'qris' },
  { name: 'Jajan sore di sekitar kantor', category: 'Hiburan', type: 'expense', amount: 200_000, monthOffset: 0, day: 16, source: 'qris' },

  // Transportasi: 430.000
  { name: 'Bensin pertamina', category: 'Transportasi', type: 'expense', amount: 250_000, monthOffset: 0, day: 5, source: 'qris' },
  { name: 'Ojek online ke kantor', category: 'Transportasi', type: 'expense', amount: 95_000, monthOffset: 0, day: 14, source: 'qris' },
  { name: 'Parkir dan tol', category: 'Transportasi', type: 'expense', amount: 85_000, monthOffset: 0, day: 7, source: 'qris' },
]

/** Ringkasan bulanan untuk 5 bulan sebelumnya (agar chart punya tren). */
const PAST_MONTH_PLAN: Array<{ income: number; freelance: number; needs: number; wants: number; transport: number }> = [
  { income: 8_500_000, freelance: 2_000_000, needs: 1_320_000, wants: 900_000, transport: 480_000 },
  { income: 8_500_000, freelance: 1_600_000, needs: 1_280_000, wants: 1_050_000, transport: 450_000 },
  { income: 8_500_000, freelance: 1_800_000, needs: 1_350_000, wants: 980_000, transport: 510_000 },
  { income: 8_500_000, freelance: 1_400_000, needs: 1_290_000, wants: 1_120_000, transport: 430_000 },
  { income: 8_500_000, freelance: 1_100_000, needs: 1_310_000, wants: 890_000, transport: 470_000 },
]

/** Pecah total menjadi beberapa transaksi dengan bobot tertentu. */
function splitAmount(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0)
  const raw = weights.map((weight) => Math.round((total * weight) / sum))
  const diff = total - raw.reduce((a, b) => a + b, 0)
  if (raw.length > 0) raw[0] += diff
  return raw
}

function dateInMonth(monthOffset: number, day: number, reference: Date): string {
  const date = new Date(reference.getFullYear(), reference.getMonth() - monthOffset, 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const safeDay = Math.min(Math.max(day, 1), lastDay)
  return toISODate(new Date(date.getFullYear(), date.getMonth(), safeDay))
}

function buildPastMonthTransactions(reference: Date): Transaction[] {
  const transactions: Transaction[] = []
  let counter = 0

  PAST_MONTH_PLAN.forEach((plan, index) => {
    const monthOffset = index + 1
    const push = (seed: Omit<Seed, 'monthOffset'>) => {
      counter += 1
      transactions.push({
        id: `seed-${monthOffset}-${counter}`,
        name: seed.name,
        category: seed.category,
        type: seed.type,
        amount: seed.amount,
        date: dateInMonth(monthOffset, seed.day, reference),
        source: seed.source ?? 'qris',
        account: seed.account,
      })
    }

    push({ name: 'Gaji karyawan PT Contoh', category: 'Gaji', type: 'income', amount: plan.income, day: 1, source: 'bank', account: 'BCA Utama' })
    push({ name: 'Proyek freelance klien', category: 'Pemasukan', type: 'income', amount: plan.freelance, day: 15 })

    const [makanan, tagihan, kesehatan] = splitAmount(plan.needs, [42, 46, 12])
    push({ name: 'Belanja dan makan harian', category: 'Makanan', type: 'expense', amount: makanan, day: 5 })
    push({ name: 'Tagihan rutin bulan ini', category: 'Tagihan', type: 'expense', amount: tagihan, day: 18, source: 'bank', account: 'BCA Utama' })
    push({ name: 'Kesehatan dan apotek', category: 'Kesehatan', type: 'expense', amount: kesehatan, day: 9 })

    const [belanja, hiburan] = splitAmount(plan.wants, [62, 38])
    push({ name: 'Belanja household', category: 'Belanja', type: 'expense', amount: belanja, day: 13 })
    push({ name: 'Hiburan akhir pekan', category: 'Hiburan', type: 'expense', amount: hiburan, day: 20 })

    const [bensin, ojek] = splitAmount(plan.transport, [58, 42])
    push({ name: 'Bensin dan tol', category: 'Transportasi', type: 'expense', amount: bensin, day: 7 })
    push({ name: 'Ojek online harian', category: 'Transportasi', type: 'expense', amount: ojek, day: 19 })
  })

  return transactions
}

/** Seluruh transaksi contoh (6 bulan terakhir, termasuk bulan berjalan). */
export function buildMockTransactions(reference: Date = new Date()): Transaction[] {
  const current: Transaction[] = CURRENT_MONTH_SEEDS.map((seed, index) => ({
    id: `seed-current-${index + 1}`,
    name: seed.name,
    category: seed.category,
    type: seed.type,
    amount: seed.amount,
    date: dateInMonth(0, seed.day, reference),
    source: seed.source ?? 'manual',
    account: seed.account,
  }))

  return [...current, ...buildPastMonthTransactions(reference)].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : a.id.localeCompare(b.id),
  )
}

/** Template anggaran bulanan (realisasi dihitung dari transaksi). */
export const BUDGET_TEMPLATES: Array<Omit<Budget, 'spent'> & { categories: string[] }> = [
  { id: 'budget-needs', name: 'Kebutuhan', limit: 2_000_000, color: 'green', categories: ['Makanan', 'Tagihan', 'Kesehatan'] },
  { id: 'budget-wants', name: 'Keinginan', limit: 1_000_000, color: 'orange', categories: ['Belanja', 'Hiburan'] },
  { id: 'budget-transport', name: 'Transportasi', limit: 700_000, color: 'blue', categories: ['Transportasi'] },
]

export const SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-laptop',
    name: 'Laptop baru',
    target: 10_000_000,
    saved: 6_800_000,
    deadline: '2026-12-31',
    note: 'Untuk kebutuhan kerja dan keseharian.',
  },
  {
    id: 'goal-emergency',
    name: 'Dana darurat',
    target: 15_000_000,
    saved: 4_200_000,
    deadline: '2027-06-30',
    note: 'Target 6 kali pengeluaran bulanan.',
  },
]

export const MOCK_SYNC_STATUS = {
  mode: 'mock' as const,
  connected: false,
  gmailConnected: false,
  lastSyncAt: null,
  message: 'Data contoh (mock) — belum terhubung ke Gmail atau bank mana pun.',
}

/** Helper untuk label sumber transaksi pada tabel. */
export function accountLabel(transaction: Transaction): string {
  if (transaction.account) return transaction.account
  if (transaction.source === 'gmail') return 'Email'
  if (transaction.source === 'qris') return 'QRIS'
  if (transaction.source === 'bank') return 'Bank'
  return 'Manual'
}

/** Period default = bulan berjalan. */
export const CURRENT_PERIOD = toPeriod(new Date())
