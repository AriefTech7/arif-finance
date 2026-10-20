import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TransactionTable } from './TransactionTable'
import type { Transaction } from '../../types/finance'

const transactions: Transaction[] = [
  {
    id: 'tx-1',
    name: 'Makan siang kantor',
    category: 'Makanan',
    type: 'expense',
    amount: 65000,
    date: '2026-10-06',
    source: 'qris',
  },
  {
    id: 'tx-2',
    name: 'Gaji karyawan',
    category: 'Gaji',
    type: 'income',
    amount: 8500000,
    date: '2026-10-01',
    source: 'bank',
    account: 'BCA Utama',
  },
]

describe('TransactionTable', () => {
  it('menampilkan baris transaksi beserta nominal', () => {
    render(<TransactionTable transactions={transactions} />)

    expect(screen.getByText('Makan siang kantor')).toBeInTheDocument()
    expect(screen.getByText('Gaji karyawan')).toBeInTheDocument()
    expect(screen.getByText(/65\.000/)).toBeInTheDocument()
    expect(screen.getAllByText('Pemasukan')).toHaveLength(1)
    expect(screen.getAllByText('Pengeluaran')).toHaveLength(1)
  })

  it('menampilkan empty state bila tidak ada transaksi', () => {
    render(<TransactionTable transactions={[]} />)
    expect(screen.getByText('Belum ada transaksi.')).toBeInTheDocument()
  })

  it('menyembunyikan tombol hapus untuk transaksi bawaan (seed)', () => {
    render(
      <TransactionTable
        transactions={[{ ...transactions[0], id: 'seed-current-1' }]}
        detailed
        canDelete={(transaction) => !transaction.id.startsWith('seed-')}
        onDelete={() => undefined}
      />,
    )

    expect(screen.queryByRole('button', { name: /Hapus transaksi/ })).not.toBeInTheDocument()
  })
})
