interface SwitchProps { checked: boolean; onCheckedChange?: (checked: boolean) => void; disabled?: boolean; size?: 'md' | 'sm'; tone?: 'brand' | 'danger'; className?: string }
const sizes = { md: { track: 'h-6 w-11', thumb: 'h-5 w-5', on: 'translate-x-5' }, sm: { track: 'h-4 w-7', thumb: 'h-3 w-3', on: 'translate-x-3' } }
export function Switch({ checked, onCheckedChange, disabled, size = 'md', tone = 'brand', className = '' }: SwitchProps) {
  const { track, thumb, on } = sizes[size]
  const color = tone === 'danger' ? 'bg-red-600 dark:bg-red-500' : 'bg-[var(--hexui-accent-solid)] dark:bg-[var(--hexui-accent-solid-dark)]'
  const trackClass = `relative shrink-0 rounded-full transition-colors disabled:opacity-40 ${track} ${checked ? color : 'bg-neutral-300 dark:bg-neutral-700'} ${className}`
  const thumbEl = <span className={`absolute left-0.5 top-0.5 rounded-full bg-white shadow-sm transition-transform ${thumb} ${checked ? on : ''}`} />
  if (!onCheckedChange) return <span role="switch" aria-checked={checked} className={`pointer-events-none ${trackClass}`}>{thumbEl}</span>
  return <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onCheckedChange(!checked)} className={trackClass}>{thumbEl}</button>
}
