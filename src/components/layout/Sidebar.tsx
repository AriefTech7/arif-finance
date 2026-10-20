import { NavLink } from 'react-router-dom'

export interface NavItem {
  to: string
  label: string
  icon: string
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Overview', icon: '▦' },
  { to: '/transaksi', label: 'Transaksi', icon: '↔' },
  { to: '/anggaran', label: 'Anggaran', icon: '◴' },
  { to: '/target', label: 'Target', icon: '◎' },
  { to: '/pengaturan', label: 'Pengaturan', icon: '⚙' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

/** Navigasi utama aplikasi (fixed di desktop, drawer di mobile). */
export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open ? <button type="button" className="sidebar-backdrop" aria-label="Tutup menu" onClick={onClose} /> : null}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            ↗
          </div>
          <span>Arif Finance</span>
          <button type="button" className="sidebar-close" onClick={onClose} aria-label="Tutup menu">
            ×
          </button>
        </div>

        <nav className="nav" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-button${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <strong>Privasi dulu</strong>
          <span>Data tersimpan lokal di browser ini. Belum ada koneksi ke Gmail atau bank.</span>
        </div>
      </aside>
    </>
  )
}
