import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { FinanceProvider } from './context/FinanceContext'
import { TransactionModalProvider } from './context/TransactionModalContext'
import './styles/index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Elemen #root tidak ditemukan di index.html')
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <FinanceProvider>
        <TransactionModalProvider>
          <App />
        </TransactionModalProvider>
      </FinanceProvider>
    </BrowserRouter>
  </StrictMode>,
)
