import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FinanceProvider } from '../../context/FinanceContext'
import { __resetMockService } from '../../services/mockFinanceService'
import { AddTransactionModal } from './AddTransactionModal'

beforeEach(() => {
  __resetMockService()
})

function renderModal() {
  const onClose = vi.fn()
  const onSaved = vi.fn()

  render(
    <MemoryRouter>
      <FinanceProvider>
        <AddTransactionModal open initialType="expense" onClose={onClose} onSaved={onSaved} />
      </FinanceProvider>
    </MemoryRouter>,
  )

  return { onClose, onSaved }
}

describe('AddTransactionModal', () => {
  it('menampilkan pesan validasi saat field wajib kosong', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.click(screen.getByRole('button', { name: 'Simpan transaksi' }))

    expect(await screen.findByText('Nama transaksi wajib diisi.')).toBeInTheDocument()
    expect(screen.getByText('Nominal wajib diisi.')).toBeInTheDocument()
  })

  it('menyimpan transaksi baru dan menutup modal', async () => {
    const user = userEvent.setup()
    const { onClose, onSaved } = renderModal()

    await user.type(screen.getByLabelText('Nama transaksi'), 'Kopi pagi')
    await user.type(screen.getByLabelText('Nominal (Rp)'), '18000')
    await user.click(screen.getByRole('button', { name: 'Simpan transaksi' }))

    await waitFor(() => expect(onSaved).toHaveBeenCalled())
    expect(onSaved.mock.calls[0][0]).toContain('Kopi pagi')
    expect(onClose).toHaveBeenCalled()
  })

  it('mengubah kategori sesuai tipe transaksi', async () => {
    const user = userEvent.setup()
    renderModal()

    expect(screen.getByRole('option', { name: 'Makanan' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '+ Pemasukan' }))

    expect(screen.getByRole('option', { name: 'Gaji' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Makanan' })).not.toBeInTheDocument()
  })
})
