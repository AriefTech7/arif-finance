import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useFinance } from '../../context/FinanceContext'

const TITLES: Record<string, { title: string; eyebrow: string }> = {
  '/': { title: 'Ringkasan finansial', eyebrow: 'Selamat datang kembali, Arif' },
  '/transaksi': { title: 'Transaksi', eyebrow: 'Semua aktivitas keuanganmu' },
  '/anggaran': { title: 'Anggaran', eyebrow: 'Atur pagu pengeluaran bulanan' },
  '/target': { title: 'Target tabungan', eyebrow: 'Tujuan yang sedang kamu kejar' },
  '/pengaturan': { title: 'Pengaturan', eyebrow: 'Preferensi aplikasi dan data' },
}

/** Kerangka aplikasi: sidebar + topbar + area konten (berbasis route). */
export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { error } = useFinance()

  const meta = TITLES[location.pathname] ?? TITLES['/']

  return (
    <div className="app">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="main">
        <Topbar title={meta.title} eyebrow={meta.eyebrow} onOpenMenu={() => setMenuOpen(true)} />

        {error ? (
          <div className="card panel" style={{ borderColor: '#f4d5d5', background: '#fff6f6', marginBottom: 18 }}>
            <strong>Gagal memuat data</strong>
            <p className="note" style={{ marginTop: 4 }}>
              {error}
            </p>
          </div>
        ) : null}

        <Outlet />
      </main>
    </div>
  )
}
