import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BudgetPanel } from './BudgetPanel'
import { SavingsGoalCard } from './SavingsGoalCard'
import { SyncStatusCard } from './SyncStatusCard'
import type { Budget, SavingsGoal, SyncStatus } from '../../types/finance'

const budgets: Budget[] = [
  { id: 'budget-needs', name: 'Kebutuhan', limit: 2_000_000, spent: 1_250_000, color: 'green' },
  { id: 'budget-wants', name: 'Keinginan', limit: 1_000_000, spent: 820_000, color: 'orange' },
]

const goal: SavingsGoal = {
  id: 'goal-laptop',
  name: 'Laptop baru',
  target: 10_000_000,
  saved: 6_800_000,
  deadline: '2026-12-31',
}

const syncStatus: SyncStatus = {
  mode: 'mock',
  connected: false,
  gmailConnected: false,
  lastSyncAt: null,
  message: 'Data contoh (mock).',
}

describe('BudgetPanel', () => {
  it('menampilkan realisasi dan pagu tiap anggaran', () => {
    render(<BudgetPanel budgets={budgets} period="2026-10" />)

    expect(screen.getByText('Anggaran bulan ini')).toBeInTheDocument()
    expect(screen.getByText('Kebutuhan')).toBeInTheDocument()
    expect(screen.getByText('Rp 1.250.000 / Rp 2.000.000')).toBeInTheDocument()
  })
})

describe('SavingsGoalCard', () => {
  it('menampilkan progres target tabungan', () => {
    render(<SavingsGoalCard goal={goal} />)

    expect(screen.getByText('Laptop baru')).toBeInTheDocument()
    expect(screen.getByText('68%')).toBeInTheDocument()
  })
})

describe('SyncStatusCard', () => {
  it('menandai dengan jelas bahwa data masih mock', () => {
    render(<SyncStatusCard status={syncStatus} />)

    expect(screen.getByText('Mode demo')).toBeInTheDocument()
    expect(screen.getByText('Belum terhubung')).toBeInTheDocument()
    expect(screen.getByText('Status: data contoh (mock)')).toBeInTheDocument()
  })
})
