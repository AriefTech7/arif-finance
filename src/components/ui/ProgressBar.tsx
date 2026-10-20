interface ProgressBarProps {
  /** Persentase 0-100. */
  value: number
  color?: 'green' | 'blue' | 'orange' | 'red'
  label?: string
}

/** Progress bar thin dengan warna sesuai status anggaran. */
export function ProgressBar({ value, color = 'green', label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value || 0))

  return (
    <div
      className="bar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={label}
    >
      <i className={`bar-fill ${color}`} style={{ width: `${clamped}%` }} />
    </div>
  )
}
