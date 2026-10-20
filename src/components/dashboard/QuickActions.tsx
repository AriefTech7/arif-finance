import { useTransactionModal } from '../../context/TransactionModalContext'

/** Aksi cepat pada dashboard. */
export function QuickActions() {
  const { openTransactionModal } = useTransactionModal()

  return (
    <article className="card panel">
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Aksi cepat</h2>
          <p className="panel-sub">Kelola keuanganmu</p>
        </div>
      </div>

      <div className="quick-actions">
        <button type="button" className="quick-action" onClick={() => openTransactionModal('income')}>
          ＋ Pemasukan
        </button>
        <button type="button" className="quick-action" onClick={() => openTransactionModal('expense')}>
          － Pengeluaran
        </button>
        <button type="button" className="quick-action" disabled title="Segera hadir bersama backend">
          ▣ Buat anggaran
        </button>
        <button type="button" className="quick-action" disabled title="Segera hadir bersama backend">
          ◎ Tambah target
        </button>
      </div>

      <p className="note" style={{ marginTop: 12 }}>
        Catatan: transaksi baru disimpan lokal di browser (mode demo).
      </p>
    </article>
  )
}
