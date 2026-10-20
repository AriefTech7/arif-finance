import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { FinanceProvider } from './context/FinanceContext'
import { TransactionModalProvider } from './context/TransactionModalContext'
import { __resetMockService } from './services/mockFinanceService'

// Chart.js butuh canvas 2d; ganti dengan stub sederhana untuk smoke test.
vi.mock('./components/dashboard/CashflowChart', () => ({
  CashflowChart: () => <div data-testid="cashflow-chart">Arus kas</div>,
}))

beforeEach(() => {
  __resetMockService()
})

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FinanceProvider>
        <TransactionModalProvider>
          <App />
        </TransactionModalProvider>
      </FinanceProvider>
    </MemoryRouter>,
  )
}

describe('Arif Finance app', () => {
  it('menampilkan ringkasan dashboard', async () => {
    renderApp('/')

    expect(await screen.findByRole('heading', { name: 'Ringkasan finansial' })).toBeInTheDocument()
    expect(screen.getByText('Total saldo')).toBeInTheDocument()
    expect(screen.getByText('Pemasukan')).toBeInTheDocument()
    expect(screen.getByText('Pengeluaran')).toBeInTheDocument()
    expect(screen.getByText('Sisa anggaran')).toBeInTheDocument()
    expect(await screen.findByTestId('cashflow-chart')).toBeInTheDocument()
    expect(screen.getByText('Transaksi terbaru')).toBeInTheDocument()
  })

  it('menandai status sinkronisasi sebagai mode demo', async () => {
    renderApp('/')

    expect(await screen.findByText('Mode demo')).toBeInTheDocument()
    expect(screen.getByText('Belum terhubung')).toBeInTheDocument()
  })

  it('berpindah halaman lewat navigasi sidebar', async () => {
    const user = userEvent.setup()
    renderApp('/')

    const link = await screen.findByRole('link', { name: /Transaksi/ })
    await user.click(link)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Transaksi' })).toBeInTheDocument()
    })
    expect(screen.getByPlaceholderText('Cari transaksi...')).toBeInTheDocument()
  })

  it('membuka modal tambah transaksi dari topbar', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(await screen.findByRole('button', { name: '+ Tambah transaksi' }))

    expect(screen.getByRole('dialog', { name: 'Tambah transaksi' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nama transaksi')).toBeInTheDocument()
  })
})
