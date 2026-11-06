import { useCallback, useRef } from 'react'
import { Tooltip } from './Tooltip'

export function OverflowTooltip({ value, className }: { value: string; className?: string }) {
  const valueRef = useRef<HTMLSpanElement>(null)
  const isOverflowing = useCallback(() => { const element = valueRef.current; return element ? element.scrollWidth > element.clientWidth : false }, [])
  return <Tooltip content={value} canOpen={isOverflowing}><span ref={valueRef} className={`min-w-0 truncate ${className ?? ''}`}>{value}</span></Tooltip>
}
