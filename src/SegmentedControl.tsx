import type { ReactNode } from 'react'

export interface SegmentedOption<T extends string> {
  value: T
  label: ReactNode
}

interface CommonProps<T extends string> {
  options: readonly SegmentedOption<T>[]
  className?: string
  disabled?: boolean
}

interface SingleProps<T extends string> extends CommonProps<T> {
  value: T
  onChange: (value: T) => void
}

interface MultiProps<T extends string> extends CommonProps<T> {
  values: ReadonlySet<T>
  onChange: (values: Set<T>) => void
}

type SegmentedControlProps<T extends string> = SingleProps<T> | MultiProps<T>

function isMulti<T extends string>(props: SegmentedControlProps<T>): props is MultiProps<T> {
  return 'values' in props
}

/**
 * An accessible row of mutually exclusive buttons. Passing `values` instead
 * of `value` enables independent multi-select without changing its layout.
 * Accent colours come from semantic CSS variables in `styles.css` so each
 * product may retain its own branding.
 */
export function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  const { options, className, disabled } = props

  function isActive(value: T): boolean {
    return isMulti(props) ? props.values.has(value) : props.value === value
  }

  function select(value: T) {
    if (!isMulti(props)) {
      props.onChange(value)
      return
    }
    const next = new Set(props.values)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    props.onChange(next)
  }

  return (
    <div
      className={`flex self-start overflow-hidden rounded-md ring ring-inset ring-neutral-200 dark:ring-neutral-800 ${disabled ? 'pointer-events-none opacity-40' : ''} ${className ?? ''}`}
    >
      {options.map((option, index) => {
        const active = isActive(option.value)
        const previousActive = index > 0 && isActive(options[index - 1].value)
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => select(option.value)}
            className={`relative flex items-center justify-center px-3 py-1.5 text-sm font-medium first:rounded-l-md last:rounded-r-md ${
              index > 0 && !previousActive
                ? "before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-neutral-200 before:content-[''] dark:before:bg-neutral-800"
                : ''
            } ${
              active
                ? 'z-10 bg-[var(--hexui-accent-soft)] text-[var(--hexui-accent-text)] ring ring-inset ring-[var(--hexui-accent-border)] before:bg-transparent dark:before:bg-transparent dark:bg-[var(--hexui-accent-soft-dark)] dark:text-[var(--hexui-accent-text-dark)] dark:ring-[var(--hexui-accent-border-dark)]'
                : 'text-[var(--hexui-text-secondary)] hover:z-10 hover:bg-neutral-100 hover:text-neutral-900 hover:ring hover:ring-inset hover:ring-neutral-200 dark:text-[var(--hexui-text-secondary-dark)] dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:hover:ring-neutral-600'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
