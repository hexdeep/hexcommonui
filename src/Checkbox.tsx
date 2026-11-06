import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react'
import { HexIcon } from './HexIcon'

export type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'type'> & {
  className?: string
  indeterminate?: boolean
}

export function Checkbox({ className, indeterminate = false, ...props }: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])
  return (
    <span className={`relative inline-flex h-4 w-4 shrink-0 ${className ?? ''}`}>
      <input
        {...props}
        ref={inputRef}
        type="checkbox"
        aria-checked={indeterminate ? 'mixed' : props.checked}
        className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
      />
      <span
        aria-hidden
        className={`relative h-full w-full rounded-[4px] bg-white ring-1 ring-inset ring-neutral-200 peer-checked:bg-[var(--hexui-accent-solid)] peer-checked:ring-[var(--hexui-accent-solid)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--hexui-accent-solid)] peer-focus-visible:ring-offset-2 peer-disabled:bg-neutral-100 peer-disabled:opacity-50 peer-disabled:ring-neutral-200 dark:bg-neutral-950 dark:ring-neutral-700 dark:peer-checked:bg-[var(--hexui-accent-solid-dark)] dark:peer-checked:ring-[var(--hexui-accent-solid-dark)] ${indeterminate ? 'bg-[var(--hexui-accent-solid)] ring-[var(--hexui-accent-solid)] dark:bg-[var(--hexui-accent-solid-dark)] dark:ring-[var(--hexui-accent-solid-dark)]' : ''}`}
      >
        {indeterminate && <span className="absolute top-1/2 left-1/2 h-px w-2 -translate-x-1/2 -translate-y-1/2 rounded bg-white" />}
      </span>
      {!indeterminate && <HexIcon name="check" width={12} className="pointer-events-none absolute inset-0 z-0 m-auto text-white opacity-0 peer-checked:opacity-100" />}
    </span>
  )
}
