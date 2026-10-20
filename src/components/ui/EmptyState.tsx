import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

/** Tampilan saat data kosong. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      {description ? <p className="note">{description}</p> : null}
      {action ? <div style={{ marginTop: 14 }}>{action}</div> : null}
    </div>
  )
}
