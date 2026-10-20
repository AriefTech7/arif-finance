/**
 * Utilitas format angka, tanggal, dan periode (semua untuk pengguna Indonesia).
 */

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const MONTHS_LONG = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })

/** `1250000` -> `Rp 1.250.000` */
export function formatRupiah(value: number): string {
  return rupiahFormatter.format(Math.round(value || 0))
}

/** Versi ringkas untuk axis chart: `Rp1,2jt`. */
export function formatRupiahShort(value: number): string {
  const amount = Math.abs(value || 0)
  const sign = value < 0 ? '-' : ''
  if (amount >= 1_000_000_000) return `${sign}Rp${(amount / 1_000_000_000).toFixed(1).replace('.', ',')}M`
  if (amount >= 1_000_000) return `${sign}Rp${(amount / 1_000_000).toFixed(1).replace('.', ',')}jt`
  if (amount >= 1_000) return `${sign}Rp${(amount / 1_000).toFixed(0)}rb`
  return `${sign}Rp${numberFormatter.format(amount)}`
}

/** `1250000` -> `1.250.000` (tanpa simbol mata uang). */
export function formatNumber(value: number): string {
  return numberFormatter.format(Math.round(value || 0))
}

/** ISO `2026-10-20` -> `20 Okt 2026` */
export function formatDate(isoDate: string): string {
  const date = parseISODate(isoDate)
  if (!date) return isoDate
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** ISO `2026-10-20` -> `Sen, 20 Okt 2026` */
export function formatDateLong(isoDate: string): string {
  const date = parseISODate(isoDate)
  if (!date) return isoDate
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** Timestamp ISO -> `20 Okt 2026, 14.05` */
export function formatDateTime(isoDateTime: string | null): string {
  if (!isoDateTime) return '-'
  const date = new Date(isoDateTime)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function parseISODate(isoDate: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate)
  if (!match) return null
  const [, year, month, day] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return Number.isNaN(date.getTime()) ? null : date
}

/** Format periode `2026-10` -> `Oktober 2026`. */
export function formatPeriod(period: string): string {
  const [year, month] = period.split('-')
  const index = Number(month) - 1
  if (!year || Number.isNaN(index) || index < 0 || index > 11) return period
  return `${MONTHS_LONG[index]} ${year}`
}

/** Format periode ringkas `2026-10` -> `Okt 26`. */
export function formatPeriodShort(period: string): string {
  const [year, month] = period.split('-')
  const index = Number(month) - 1
  if (!year || Number.isNaN(index) || index < 0 || index > 11) return period
  return `${MONTHS_SHORT[index]} ${year.slice(-2)}`
}

/** Periode `YYYY-MM` dari objek Date. */
export function toPeriod(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/** Tanggal `YYYY-MM-DD` dari objek Date. */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** Geser periode sejumlah bulan (negatif = ke belakang). */
export function shiftPeriod(period: string, delta: number): string {
  const [year, month] = period.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  return toPeriod(date)
}

/** Deret opsi periode terbaru (terlama baru = index 0). */
export function recentPeriods(count: number, from: Date = new Date()): string[] {
  const current = toPeriod(from)
  return Array.from({ length: count }, (_, index) => shiftPeriod(current, -index))
}

/** Label bulan singkat untuk chart, contoh `Okt`. */
export function monthLabel(period: string): string {
  const month = Number(period.split('-')[1]) - 1
  if (Number.isNaN(month) || month < 0 || month > 11) return period
  return MONTHS_SHORT[month]
}

/** Persentase perubahan antar periode. */
export function changePercent(current: number, previous: number): number {
  if (!previous) return current ? 100 : 0
  return ((current - previous) / previous) * 100
}

/** Format persentase dengan tanda, contoh `+8,4%`. */
export function formatPercent(value: number, withSign = false): string {
  const rounded = Math.round(value * 10) / 10
  const text = `${Math.abs(rounded).toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`
  if (!withSign) return text
  if (rounded > 0) return `+${text}`
  if (rounded < 0) return `-${text}`
  return text
}

export const MONTH_NAMES = MONTHS_SHORT
