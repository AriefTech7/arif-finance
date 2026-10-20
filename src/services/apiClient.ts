/**
 * Klien HTTP tipis untuk API Arif Finance.
 *
 * Belum ada backend sungguhan — file ini hanya menyiapkan "jembatan" agar
 * frontend dapat beralih ke API nyata tanpa mengubah komponen UI.
 * Tidak ada kredensial atau token yang disimpan di repo ini.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

export class ApiError extends Error {
  status: number
  payload: unknown

  constructor(message: string, status: number, payload?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  query?: Record<string, string | number | boolean | undefined | null>
  /** Timeout request dalam milidetik. */
  timeoutMs?: number
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${API_BASE_URL}${normalizedPath}`
  if (!query) return url

  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    params.set(key, String(value))
  })
  const search = params.toString()
  return search ? `${url}?${search}` : url
}

/**
 * Melakukan request JSON dan mengembalikan payload yang sudah di-parse.
 * Melempar `ApiError` bila server merespons dengan status error.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, query, timeoutMs = 15_000, headers, ...rest } = options

  if (!API_BASE_URL) {
    throw new ApiError('VITE_API_BASE_URL belum diisi — API tidak bisa dipanggil.', 0)
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(buildUrl(path, query), {
      ...rest,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    const text = await response.text()
    const payload = text ? safeParse(text) : null

    if (!response.ok) {
      const errorMessage =
        payload && typeof payload === 'object' && 'message' in payload
          ? String((payload as { message: unknown }).message)
          : `Permintaan gagal (${response.status}).`
      throw new ApiError(errorMessage, response.status, payload)
    }

    return payload as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Permintaan melebihi batas waktu.', 408)
    }
    throw new ApiError(error instanceof Error ? error.message : 'Kesalahan jaringan tidak diketahui.', 0)
  } finally {
    clearTimeout(timer)
  }
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const apiConfig = {
  baseUrl: API_BASE_URL,
  isConfigured: API_BASE_URL.length > 0,
}
