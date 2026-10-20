# Arif Finance — Frontend Fondasi

Dashboard keuangan pribadi untuk memantau **pemasukan, pengeluaran, anggaran, dan target tabungan**.
Versi ini adalah **fondasi frontend**: seluruh data masih berupa contoh (mock) yang tersimpan di browser,
tanpa backend, database, autentikasi, maupun integrasi Gmail.

Prototipe statis yang dipakai sebagai referensi visual berada di
`/home/homie-server/personal-finance/index.html` (file tersebut tidak diubah oleh proyek ini).

---

## Fitur saat ini

| Fitur | Status |
| --- | --- |
| Navigasi sidebar responsif (desktop + drawer mobile) | ✅ |
| Halaman Overview: saldo, pemasukan, pengeluaran, sisa anggaran | ✅ |
| Grafik arus kas 6 bulan (Chart.js) | ✅ |
| Progres anggaran per kategori | ✅ |
| Kartu target tabungan | ✅ |
| Tabel transaksi + pencarian + filter tipe/kategori | ✅ |
| Ekspor CSV | ✅ |
| Modal tambah transaksi (state lokal) | ✅ |
| Kartu status sinkronisasi bertanda "Mode demo" | ✅ |
| Halaman Anggaran, Target, Pengaturan | ✅ |
| Backend, database, autentikasi, integrasi Gmail/real sync | ⛔ belum (di luar cakupan) |

> **Penting:** seluruh nominal pada dashboard adalah **data fiktif**. Tidak ada kredensial, token, atau
> koneksi eksternal yang dikonfigurasi di repo ini. Transaksi yang kamu tambahkan hanya disimpan di
> `localStorage` browser dengan key `arif-finance.transactions.v1`.

---

## Stack teknologi

- **React 19** + **TypeScript** (strict)
- **Vite 7** (dev server + build)
- **React Router 7** (routing sisi klien)
- **Chart.js 4** + `react-chartjs-2` (grafik arus kas)
- **Vitest 3** + Testing Library (unit & smoke test)
- Tanpa UI framework eksternal — styling memakai CSS biasa dengan design token.

---

## Menjalankan proyek

```bash
npm install        # pasang dependency
npm run dev        # dev server di http://localhost:5173
npm run build      # type-check + build produksi ke ./dist
npm run preview    # jalankan hasil build
npm test           # jalankan seluruh test sekali jalan
npm run test:watch # mode watch
npm run typecheck  # hanya type-check (tsc --noEmit)
```

Persyaratan: Node.js ≥ 20 (diuji pada Node 26) dan npm ≥ 10.

### Environment

Salin `.env.example` menjadi `.env` bila ingin menyiapkan jembatan ke API:

```bash
cp .env.example .env
```

| Variabel | Default | Keterangan |
| --- | --- | --- |
| `VITE_API_BASE_URL` | *(kosong)* | Base URL API, mis. `http://localhost:3000/api/v1`. Kosong = mode mock. |
| `VITE_DATA_SOURCE` | `mock` | `mock` (data lokal) atau `http` (memakai `VITE_API_BASE_URL`). |

Tidak ada nilai rahasia yang perlu diisi. `.env` sudah masuk `.gitignore`.

---

## Struktur proyek

```
src/
├── components/
│   ├── dashboard/        # StatCards, CashflowChart, BudgetPanel, SavingsGoalCard,
│   │                     # SyncStatusCard, QuickActions, RecentTransactions
│   ├── layout/           # AppLayout, Sidebar, Topbar
│   ├── modals/           # AddTransactionModal
│   ├── transactions/     # TransactionTable, TransactionFilters
│   └── ui/               # Modal, ProgressBar, StatusPill, EmptyState
├── context/              # FinanceContext (state global), TransactionModalContext (modal + toast)
├── data/                 # mockData.ts — seluruh data contoh
├── pages/                # Overview, Transaksi, Anggaran, Target, Pengaturan
├── services/             # batas layanan: financeService (interface), mock & http service, apiClient
├── styles/               # index.css — token desain + seluruh gaya
├── types/                # tipe domain (Transaction, Budget, SavingsGoal, ...)
├── utils/                # format (rupiah/tanggal/periode), storage (localStorage aman)
└── test/                 # setup test (canvas, localStorage, ResizeObserver)
```

Alur data:

```
Komponen UI  →  useFinance()  →  FinanceProvider  →  financeService  →  mock | http
                                                    (src/services/index.ts)
```

---

## Batas API (kontrak untuk backend berikutnya)

Frontend **tidak pernah** memanggil `fetch` langsung dari komponen. Semua akses data melewati
interface `FinanceService` di `src/services/financeService.ts`:

```ts
export interface FinanceService {
  listTransactions(query?: TransactionQuery): Promise<Transaction[]>
  createTransaction(input: CreateTransactionInput): Promise<Transaction>
  updateTransaction(id: string, input: UpdateTransactionInput): Promise<Transaction>
  deleteTransaction(id: string): Promise<void>
  getBudgets(period: string): Promise<Budget[]>
  getGoals(): Promise<SavingsGoal[]>
  getCashflow(months?: number): Promise<CashflowPoint[]>
  getBalance(): Promise<number>
  getSyncStatus(): Promise<SyncStatus>
}
```

### Beralih dari mock ke API

1. Isi `VITE_API_BASE_URL` pada `.env`.
2. Ubah `VITE_DATA_SOURCE=http`.
3. Sediakan endpoint berikut di backend (prefix sama dengan `VITE_API_BASE_URL`).

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| `GET` | `/transactions` | query `period` (`YYYY-MM`), `type` (`income`/`expense`), `category`, `search` | `Transaction[]` |
| `POST` | `/transactions` | body `CreateTransactionInput` | `Transaction` |
| `PATCH` | `/transactions/:id` | body `UpdateTransactionInput` | `Transaction` |
| `DELETE` | `/transactions/:id` | – | `204 No Content` |
| `GET` | `/budgets` | query `period` | `Budget[]` |
| `GET` | `/goals` | – | `SavingsGoal[]` |
| `GET` | `/cashflow` | query `months` (default 6) | `CashflowPoint[]` |
| `GET` | `/balance` | – | `{ "balance": number }` |
| `GET` | `/sync/status` | – | `SyncStatus` |

Bentuk payload (lihat `src/types/finance.ts`):

```jsonc
// Transaction
{
  "id": "tx_123",
  "name": "Makan siang kantor",
  "category": "Makanan",
  "type": "expense",          // "income" | "expense"
  "amount": 65000,            // Rupiah penuh
  "date": "2026-10-06",       // ISO YYYY-MM-DD
  "source": "qris",           // "manual" | "gmail" | "qris" | "bank"
  "account": "BCA Utama",     // opsional
  "note": "Dibayar QRIS"      // opsional
}

// Budget
{ "id": "budget-needs", "name": "Kebutuhan", "limit": 2000000, "spent": 1250000, "color": "green" }

// SavingsGoal
{ "id": "goal-laptop", "name": "Laptop baru", "target": 10000000, "saved": 6800000, "deadline": "2026-12-31" }

// CashflowPoint
{ "period": "2026-10", "label": "Okt", "income": 12000000, "expense": 2500000 }

// SyncStatus
{ "mode": "live", "connected": true, "gmailConnected": true, "lastSyncAt": "2026-10-20T07:00:00Z", "message": "Sinkron terakhir 2 jam lalu" }
```

### Aturan main service (backend)

- Semua nominal dalam **Rupiah penuh** (bukan ribuan).
- Tanggal transaksi `YYYY-MM-DD`, periode `YYYY-MM`.
- `GET /transactions` **wajib** hormati query `period` agar angka ringkasan konsisten dengan tabel.
- Balas error dengan JSON `{ "message": "..." }`; `apiClient` akan mengambil pesan tersebut dan
  menampilkannya di UI (lihat `src/services/apiClient.ts`).
- `mode` pada `SyncStatus` bernilai `"live"` hanya bila integrasi sungguhan aktif; frontend menandai
  `"mock"` sebagai "Mode demo" di kartu status sinkronisasi.

---

## Pengujian

```bash
npm test
```

Test yang tersedia:

- `src/utils/format.test.ts` — format rupiah, tanggal, periode, persentase.
- `src/services/mockFinanceService.test.ts` — list/filter/tambah/hapus transaksi, anggaran, arus kas, status sinkronisasi.
- `src/components/transactions/TransactionTable.test.tsx` — render tabel, empty state, aturan hapus.
- `src/components/modals/AddTransactionModal.test.tsx` — validasi form, penyimpanan, pergantian kategori.
- `src/components/dashboard/CashflowChart.test.tsx` — integrasi Chart.js benar-benar ter-render.
- `src/components/dashboard/panels.test.tsx` — panel anggaran, target tabungan, kartu status sinkronisasi.
- `src/App.test.tsx` — smoke test: dashboard, navigasi sidebar, dan modal transaksi.

---

## Langkah berikutnya (di luar cakupan versi ini)

1. **Backend & database** — service API sesuai tabel kontrak di atas (PostgreSQL/SQLite).
2. **Autentikasi** — login pengguna + session, sebelum data bisa disimpan per pengguna.
3. **Integrasi Gmail** — parser notifikasi/email transaksi, sinkronisasi berkala, status `gmailConnected`.
4. **Sinkronisasi bank/QRIS** — impor mutasi rekening, rekonsiliasi kategori otomatis.
5. **Anggaran & target dinamis** — CRUD pagu anggaran dan setoran target (Saat ini `Budget` dan
   `SavingsGoal` masih data contoh; tombol tambah di halaman Anggaran/Target ditandai sebagai simulasi).
6. **Paginasi & filter lanjutan** pada tabel transaksi.

---

## Lisensi

Proyek pribadi/internal — belum ada lisensi yang ditetapkan.
