import { apiConfig } from '../../services/apiClient'
import { isMockMode } from '../../services'
import type { SyncStatus } from '../../types/finance'
import { formatDateTime } from '../../utils/format'

interface SyncStatusCardProps {
  status: SyncStatus | null
}

/**
 * Kartu status sinkronisasi.
 *
 * Selalu menandai bahwa aplikasi sedang berjalan dengan data contoh (mock)
 * dan belum terhubung ke Gmail/API mana pun.
 */
export function SyncStatusCard({ status }: SyncStatusCardProps) {
  const connected = Boolean(status?.connected)
  const gmailConnected = Boolean(status?.gmailConnected)

  return (
    <article className="card panel sync-card">
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Status sinkronisasi</h2>
          <p className="panel-sub">Belum ada koneksi ke layanan eksternal</p>
        </div>
        <span className="sync-badge">
          <span className="sync-dot" aria-hidden="true" />
          Mode demo
        </span>
      </div>

      <ul className="sync-list">
        <li>
          <span>Sumber data</span>
          <strong>{isMockMode ? 'Mock lokal (localStorage)' : 'REST API'}</strong>
        </li>
        <li>
          <span>Gmail</span>
          <strong>{gmailConnected ? 'Terhubung' : 'Belum terhubung'}</strong>
        </li>
        <li>
          <span>Sinkronisasi terakhir</span>
          <strong>{formatDateTime(status?.lastSyncAt ?? null)}</strong>
        </li>
        <li>
          <span>Base URL API</span>
          <strong>{apiConfig.isConfigured ? apiConfig.baseUrl : '—'}</strong>
        </li>
      </ul>

      <p className="sync-note">
        <strong style={{ display: 'block', marginBottom: 4, color: '#fff' }}>
          {connected ? 'Status: tersambung' : 'Status: data contoh (mock)'}
        </strong>
        {status?.message ??
          'Semua angka pada dashboard ini adalah data fiktif. Integrasi Gmail, bank, dan penyimpanan server belum tersedia.'}
      </p>
    </article>
  )
}
