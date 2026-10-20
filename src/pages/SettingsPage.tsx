import { apiConfig } from '../services/apiClient'
import { isMockMode } from '../services'
import { useFinance } from '../context/FinanceContext'
import { formatDateTime } from '../utils/format'
import { removeItem } from '../utils/storage'

const STORAGE_KEY = 'arif-finance.transactions.v1'

/** Halaman pengaturan: status sumber data, privasi, dan utilitas demo. */
export function SettingsPage() {
  const { syncStatus, refresh } = useFinance()

  function resetDemoData() {
    removeItem(STORAGE_KEY)
    void refresh()
  }

  return (
    <div className="stack">
      <section className="card page-card">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Sumber data</h2>
            <p className="panel-sub">Batas antara mode demo dan API sungguhan</p>
          </div>
          <span className="pill mock">Mode demo</span>
        </div>

        <div className="list-rows">
          <div className="list-row">
            <div>
              <strong>Provider data</strong>
              <span>Layer service yang dipakai frontend</span>
            </div>
            <span className="pill neutral">{isMockMode ? 'mockFinanceService' : 'httpFinanceService'}</span>
          </div>
          <div className="list-row">
            <div>
              <strong>VITE_API_BASE_URL</strong>
              <span>Base URL API (isi di file .env lokal)</span>
            </div>
            <span className="pill neutral">{apiConfig.isConfigured ? apiConfig.baseUrl : 'Belum diisi'}</span>
          </div>
          <div className="list-row">
            <div>
              <strong>VITE_DATA_SOURCE</strong>
              <span>mock (default) atau http</span>
            </div>
            <span className="pill neutral">{isMockMode ? 'mock' : 'http'}</span>
          </div>
          <div className="list-row">
            <div>
              <strong>Sinkronisasi terakhir</strong>
              <span>Status integrasi Gmail/bank</span>
            </div>
            <span className="pill neutral">{formatDateTime(syncStatus?.lastSyncAt ?? null)}</span>
          </div>
        </div>
      </section>

      <section className="card page-card">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Privasi & data</h2>
            <p className="panel-sub">Yang terjadi pada data yang kamu masukkan</p>
          </div>
        </div>
        <p className="note">
          Saat ini seluruh transaksi hanya tersimpan di localStorage browser ini. Tidak ada kredensial, token,
          atau koneksi ke Gmail/bank yang dikonfigurasi di proyek ini. Seluruh nominal pada dashboard adalah
          data contoh (mock).
        </p>
        <div className="panel-actions" style={{ justifyContent: 'flex-start', marginTop: 16 }}>
          <button type="button" className="danger" onClick={resetDemoData}>
            Reset data demo di browser ini
          </button>
        </div>
      </section>

      <section className="card page-card">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Tentang aplikasi</h2>
            <p className="panel-sub">Arif Finance — frontend fondasi</p>
          </div>
        </div>
        <p className="note">
          Fondasi frontend untuk dashboard keuangan pribadi. Versi ini fokus pada antarmuka: navigasi sidebar,
          ringkasan dashboard, tabel transaksi, modal tambah transaksi, dan status sinkronisasi mock.
          Backend, autentikasi, database, dan integrasi Gmail belum termasuk dalam cakupan pekerjaan ini.
        </p>
      </section>
    </div>
  )
}
