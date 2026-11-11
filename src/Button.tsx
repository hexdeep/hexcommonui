import type { ComponentPropsWithoutRef } from 'react'

export type ButtonVariant = 'plain' | 'primary' | 'danger'
export type ButtonSize = 'base' | 'small'

export type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'className'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

// Quiet, outlined buttons: a tinted fill and a ring rather than a solid
// colour. primary takes the accent, danger is red.
const variants: Record<ButtonVariant, string> = {
  plain:
    'bg-neutral-50 text-[var(--hexui-text-secondary)] ring-neutral-200 hover:bg-neutral-100 hover:ring-neutral-300 dark:bg-neutral-800 dark:text-[var(--hexui-text-secondary-dark)] dark:ring-neutral-700 dark:hover:bg-neutral-700 dark:hover:ring-neutral-600',
  primary:
    'bg-[var(--hexui-accent-soft)] text-[var(--hexui-accent-text)] ring-[var(--hexui-accent-border)] hover:brightness-95 dark:bg-[var(--hexui-accent-soft-dark)] dark:text-[var(--hexui-accent-text-dark)] dark:ring-[var(--hexui-accent-border-dark)] dark:hover:brightness-125',
  danger:
    'bg-red-50 text-red-600 ring-red-200 hover:bg-red-100 hover:ring-red-300 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-900 dark:hover:bg-red-950/70 dark:hover:ring-red-800',
}

const sizes: Record<ButtonSize, string> = {
  base: 'gap-1.5 px-3 py-1.5 text-sm',
  small: 'gap-1 px-2 py-1 text-xs',
}

export function Button({ variant = 'plain', size = 'base', className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={`inline-flex items-center justify-center rounded-md font-medium ring-1 ring-inset disabled:pointer-events-none disabled:opacity-40 ${sizes[size]} ${variants[variant]} ${className}`}
    />
  )
}
