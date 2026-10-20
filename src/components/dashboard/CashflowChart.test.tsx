import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CashflowChart } from './CashflowChart'
import type { CashflowPoint } from '../../types/finance'

const data: CashflowPoint[] = [
  { period: '2026-09', label: 'Sep', income: 10_500_000, expense: 2_700_000 },
  { period: '2026-10', label: 'Okt', income: 12_000_000, expense: 2_500_000 },
]

describe('CashflowChart', () => {
  it('merender chart tanpa error', () => {
    const { container } = render(<CashflowChart data={data} />)

    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute('aria-label', 'Grafik arus kas')
  })

  it('menampilkan judul aksesibel', () => {
    render(<CashflowChart data={data} />)
    expect(screen.getByRole('img', { name: 'Grafik arus kas' })).toBeInTheDocument()
  })
})
