/**
 * Pembungkus `localStorage` yang aman.
 *
 * - Tidak melempar error ketika browser memblokir penyimpanan (mode privat).
 * - Menyediakan fallback in-memory agar aplikasi tetap berjalan di lingkungan
 *   tanpa `localStorage` (misalnya server-side rendering atau unit test).
 */

const memoryStore = new Map<string, string>()

function getStore(): Storage | null {
  try {
    const store = globalThis.localStorage
    if (store) return store
  } catch {
    /* storage diblokir browser */
  }
  return null
}

export function readItem(key: string): string | null {
  const store = getStore()
  if (store) {
    try {
      return store.getItem(key)
    } catch {
      /* abaikan dan lanjut ke fallback */
    }
  }
  return memoryStore.get(key) ?? null
}

export function writeItem(key: string, value: string): void {
  const store = getStore()
  if (store) {
    try {
      store.setItem(key, value)
      return
    } catch {
      /* abaikan dan lanjut ke fallback */
    }
  }
  memoryStore.set(key, value)
}

export function removeItem(key: string): void {
  const store = getStore()
  if (store) {
    try {
      store.removeItem(key)
    } catch {
      /* abaikan */
    }
  }
  memoryStore.delete(key)
}

export function readJson<T>(key: string, fallback: T): T {
  const raw = readItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    writeItem(key, JSON.stringify(value))
  } catch {
    /* abaikan: nilai tidak bisa diserialisasi */
  }
}
