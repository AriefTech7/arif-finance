/**
 * Titik masuk pemuatan service.
 *
 * Default-nya data mock (lokal). Ubah `VITE_DATA_SOURCE=http` dan isi
 * `VITE_API_BASE_URL` untuk beralih ke API sungguhan tanpa mengubah UI.
 */

import { apiConfig } from './apiClient'
import type { FinanceService } from './financeService'
import { httpFinanceService } from './httpFinanceService'
import { mockFinanceService } from './mockFinanceService'

const dataSource = (import.meta.env.VITE_DATA_SOURCE ?? 'mock').toLowerCase()

export const isMockMode = dataSource !== 'http' || !apiConfig.isConfigured

export const financeService: FinanceService = isMockMode ? mockFinanceService : httpFinanceService

export type { FinanceService } from './financeService'
