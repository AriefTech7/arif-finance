import { describe, expect, it } from 'vitest'
import {
  changePercent,
  formatDate,
  formatNumber,
  formatPercent,
  formatPeriod,
  formatRupiah,
  formatRupiahShort,
  monthLabel,
  recentPeriods,
  shiftPeriod,
  toISODate,
  toPeriod,
} from './format'

const normalize = (value: string) => value.replace(/\u00a0/g, ' ')

describe('formatRupiah', () => {
  it('memformat nominal rupiah dengan pemisah ribuan', () => {
    expect(normalize(formatRupiah(1250000))).toBe('Rp 1.250.000')
    expect(normalize(formatRupiah(0))).toBe('Rp 0')
  })

  it('menangani nilai negatif', () => {
    expect(normalize(formatRupiah(-25000))).toContain('-')
  })
})

describe('formatRupiahShort', () => {
  it('memendekkan nilai besar', () => {
    expect(formatRupiahShort(1500000)).toBe('Rp1,5jt')
    expect(formatRupiahShort(2500)).toBe('Rp3rb')
  })
})

describe('formatDate', () => {
  it('menggunakan format Indonesia', () => {
    expect(formatDate('2026-10-20')).toBe('20 Okt 2026')
  })

  it('mengembalikan input mentah bila tidak valid', () => {
    expect(formatDate('bukan tanggal')).toBe('bukan tanggal')
  })
})

describe('periode', () => {
  it('mengubah tanggal menjadi periode dan ISO date', () => {
    const date = new Date(2026, 9, 20)
    expect(toPeriod(date)).toBe('2026-10')
    expect(toISODate(date)).toBe('2026-10-20')
  })

  it('menggeser periode', () => {
    expect(shiftPeriod('2026-01', -1)).toBe('2025-12')
    expect(shiftPeriod('2026-12', 1)).toBe('2027-01')
  })

  it('menyediakan daftar periode terbaru', () => {
    const periods = recentPeriods(3, new Date(2026, 9, 20))
    expect(periods).toEqual(['2026-10', '2026-09', '2026-08'])
  })

  it('memformat label periode', () => {
    expect(formatPeriod('2026-10')).toBe('Oktober 2026')
    expect(monthLabel('2026-10')).toBe('Okt')
  })
})

describe('perubahan persentase', () => {
  it('menghitung selisih antar periode', () => {
    expect(changePercent(110, 100)).toBeCloseTo(10)
    expect(changePercent(90, 100)).toBeCloseTo(-10)
    expect(changePercent(50, 0)).toBe(100)
  })

  it('memformat persentase bertanda', () => {
    expect(formatPercent(8.4, true)).toBe('+8,4%')
    expect(formatPercent(-8.4, true)).toBe('-8,4%')
  })
})

describe('formatNumber', () => {
  it('memformat angka plain', () => {
    expect(formatNumber(1500000)).toBe('1.500.000')
  })
})
