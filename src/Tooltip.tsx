import { useRef, useState, type ReactElement, type ReactNode } from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <RadixTooltip.Provider delayDuration={250} skipDelayDuration={100}>{children}</RadixTooltip.Provider>
}

export function Tooltip({ content, children, canOpen, delayDuration }: { content?: ReactNode; children: ReactElement; canOpen?: () => boolean; delayDuration?: number }) {
  const [open, setOpen] = useState(false)
  const keepOpenAfterContextMenu = useRef(false)
  if (!content) return children
  function preserveOpenForContextMenu() {
    keepOpenAfterContextMenu.current = true
    window.setTimeout(() => { keepOpenAfterContextMenu.current = false }, 0)
  }
  return (
    <RadixTooltip.Root open={open} delayDuration={delayDuration} onOpenChange={(next) => {
      if (!next && keepOpenAfterContextMenu.current) { keepOpenAfterContextMenu.current = false; return }
      setOpen(next && (canOpen?.() ?? true))
    }}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content sideOffset={5} onPointerDownCapture={(event) => { if (event.button === 2) preserveOpenForContextMenu() }} onContextMenuCapture={preserveOpenForContextMenu} className="z-[70] max-w-72 rounded-md bg-neutral-800 px-2 py-1 text-xs break-words text-neutral-100 leading-relaxed ring-1 ring-inset ring-neutral-700 dark:bg-neutral-100 dark:text-neutral-800 dark:ring-neutral-300">
          {content}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
