/**
 * Konteks kecil untuk membuka modal tambah transaksi dari mana saja
 * (topbar, aksi cepat, halaman transaksi) + notifikasi toast.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { TransactionType } from '../types/finance'
import { AddTransactionModal } from '../components/modals/AddTransactionModal'

interface TransactionModalContextValue {
  openTransactionModal: (type?: TransactionType) => void
  closeTransactionModal: () => void
  notify: (message: string) => void
}

const TransactionModalContext = createContext<TransactionModalContextValue | null>(null)

export function TransactionModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<TransactionType>('expense')
  const [toast, setToast] = useState<string | null>(null)

  const openTransactionModal = useCallback((nextType: TransactionType = 'expense') => {
    setType(nextType)
    setOpen(true)
  }, [])

  const closeTransactionModal = useCallback(() => setOpen(false), [])

  const notify = useCallback((message: string) => setToast(message), [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  const value = useMemo<TransactionModalContextValue>(
    () => ({ openTransactionModal, closeTransactionModal, notify }),
    [closeTransactionModal, notify, openTransactionModal],
  )

  return (
    <TransactionModalContext.Provider value={value}>
      {children}
      <AddTransactionModal
        open={open}
        initialType={type}
        onClose={closeTransactionModal}
        onSaved={notify}
      />
      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </TransactionModalContext.Provider>
  )
}

export function useTransactionModal(): TransactionModalContextValue {
  const context = useContext(TransactionModalContext)
  if (!context) {
    throw new Error('useTransactionModal harus dipakai di dalam <TransactionModalProvider>.')
  }
  return context
}
