import type { ReactNode } from 'react'

export function Field({
  label,
  hint,
  children,
  className = 'block space-y-1',
}: {
  label: ReactNode
  hint?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <label className={className}>
      <span className="block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-neutral-500 dark:text-neutral-400">{hint}</span>}
    </label>
  )
}
