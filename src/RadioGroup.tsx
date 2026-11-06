import { useId } from 'react'

export function RadioGroup<T extends string>({ value, onChange, options, className }: { value: T; onChange: (value: T) => void; options: readonly { value: T; label: string }[]; className?: string }) {
  const name = useId()
  return <div role="radiogroup" className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 ${className ?? ''}`}>{options.map((option) => <label key={option.value} className="flex cursor-pointer items-center gap-1.5"><span className="relative inline-flex h-4 w-4 shrink-0"><input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none opacity-0" /><span aria-hidden className="h-full w-full rounded-full bg-white ring-1 ring-inset ring-neutral-300 peer-checked:ring-[5px] peer-checked:ring-[var(--hexui-accent-solid)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--hexui-accent-solid)] dark:bg-neutral-950 dark:ring-neutral-600 dark:peer-checked:ring-[var(--hexui-accent-solid-dark)]" /></span>{option.label}</label>)}</div>
}
