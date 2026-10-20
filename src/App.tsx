import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { BudgetsPage } from './pages/BudgetsPage'
import { GoalsPage } from './pages/GoalsPage'
import { OverviewPage } from './pages/OverviewPage'
import { SettingsPage } from './pages/SettingsPage'
import { TransactionsPage } from './pages/TransactionsPage'

/** Definisi routing aplikasi (berbasis layout utama). */
export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/transaksi" element={<TransactionsPage />} />
        <Route path="/anggaran" element={<BudgetsPage />} />
        <Route path="/target" element={<GoalsPage />} />
        <Route path="/pengaturan" element={<SettingsPage />} />
        <Route path="*" element={<OverviewPage />} />
      </Route>
    </Routes>
  )
}
