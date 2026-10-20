import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { CATEGORIES, INCOME_CATEGORIES } from '../../data/mockData'
import { useFinance } from '../../context/FinanceContext'
import type { TransactionType } from '../../types/finance'
import { formatRupiah, toISODate } from '../../utils/format'
import { Modal } from '../ui/Modal'

interface AddTransactionModalProps {
  open: boolean
  initialType: TransactionType
  onClose: () => void
  onSaved: (message: string) => void
}

interface FormState {
  name: string
  amount: string
  type: TransactionType
  category: string
  date: string
  note: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const DEFAULT_EXPENSE_CATEGORY = 'Makanan'
const DEFAULT_INCOME_CATEGORY = 'Gaji'

/**
 * Modal tambah transaksi.
 *
 * Saat ini data disimpan pada state lokal (mock service + localStorage),
 * belum dikirim ke server mana pun.
 */
export function AddTransactionModal({ open, initialType, onClose, onSaved }: AddTransactionModalProps) {
  const { addTransaction, saving } = useFinance()
  const [form, setForm] = useState<FormState>({
    name: '',
    amount: '',
    type: initialType,
    category: initialType === 'income' ? DEFAULT_INCOME_CATEGORY : DEFAULT_EXPENSE_CATEGORY,
    date: toISODate(new Date()),
    note: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (!open) return
    setForm({
      name: '',
      amount: '',
      type: initialType,
      category: initialType === 'income' ? DEFAULT_INCOME_CATEGORY : DEFAULT_EXPENSE_CATEGORY,
      date: toISODate(new Date()),
      note: '',
    })
    setErrors({})
  }, [open, initialType])

  const categoryOptions = useMemo(() => {
    if (form.type === 'income') return INCOME_CATEGORIES
    return CATEGORIES.filter((category) => !INCOME_CATEGORIES.includes(category as (typeof INCOME_CATEGORIES)[number]))
  }, [form.type])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => ({ ...previous, [key]: undefined }))
  }

  function changeType(type: TransactionType) {
    setForm((previous) => ({
      ...previous,
      type,
      category: type === 'income' ? DEFAULT_INCOME_CATEGORY : DEFAULT_EXPENSE_CATEGORY,
    }))
    setErrors((previous) => ({ ...previous, category: undefined }))
  }

  function validate(): boolean {
    const next: FormErrors = {}
    if (!form.name.trim()) next.name = 'Nama transaksi wajib diisi.'
    const amount = Number(form.amount)
    if (!form.amount.trim()) next.amount = 'Nominal wajib diisi.'
    else if (!Number.isFinite(amount) || amount <= 0) next.amount = 'Nominal harus lebih besar dari 0.'
    if (!form.date) next.date = 'Tanggal wajib diisi.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) return

    try {
      await addTransaction({
        name: form.name.trim(),
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
        note: form.note.trim() || undefined,
      })
      onSaved(`Transaksi "${form.name.trim()}" disimpan (mode demo).`)
      onClose()
    } catch {
      /* pesan error sudah ditangani oleh provider */
    }
  }

  const amountPreview = Number(form.amount) > 0 ? formatRupiah(Number(form.amount)) : ''

  return (
    <Modal open={open} title="Tambah transaksi" onClose={onClose}>
      <form id="add-transaction-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="tx-name">Nama transaksi</label>
            <input
              id="tx-name"
              name="name"
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              placeholder="Contoh: Makan siang"
              autoComplete="off"
            />
            {errors.name ? <span className="field-error">{errors.name}</span> : null}
          </div>

          <div className="field">
            <label htmlFor="tx-amount">Nominal (Rp)</label>
            <input
              id="tx-amount"
              name="amount"
              type="number"
              min="1"
              step="1000"
              inputMode="numeric"
              value={form.amount}
              onChange={(event) => update('amount', event.target.value)}
              placeholder="25000"
            />
            {errors.amount ? (
              <span className="field-error">{errors.amount}</span>
            ) : (
              <span className="field-hint">{amountPreview || 'Isi dengan angka penuh, tanpa titik.'}</span>
            )}
          </div>

          <div className="field">
            <span className="field-label">Tipe transaksi</span>
            <div className="type-switch" role="group" aria-label="Tipe transaksi">
              <button
                type="button"
                data-type="expense"
                className={form.type === 'expense' ? 'active' : ''}
                onClick={() => changeType('expense')}
                aria-pressed={form.type === 'expense'}
              >
                − Pengeluaran
              </button>
              <button
                type="button"
                data-type="income"
                className={form.type === 'income' ? 'active' : ''}
                onClick={() => changeType('income')}
                aria-pressed={form.type === 'income'}
              >
                + Pemasukan
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="tx-category">Kategori</label>
              <select
                id="tx-category"
                name="category"
                value={form.category}
                onChange={(event) => update('category', event.target.value)}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category ? <span className="field-error">{errors.category}</span> : null}
            </div>

            <div className="field">
              <label htmlFor="tx-date">Tanggal</label>
              <input
                id="tx-date"
                name="date"
                type="date"
                value={form.date}
                onChange={(event) => update('date', event.target.value)}
              />
              {errors.date ? <span className="field-error">{errors.date}</span> : null}
            </div>
          </div>

          <div className="field">
            <label htmlFor="tx-note">Catatan (opsional)</label>
            <input
              id="tx-note"
              name="note"
              value={form.note}
              onChange={(event) => update('note', event.target.value)}
              placeholder="Contoh: dibayar dengan QRIS"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="ghost" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="primary" disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan transaksi'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
