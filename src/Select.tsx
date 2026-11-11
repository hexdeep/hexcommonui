import { useRef, useState, type ReactNode } from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import { HexIcon } from './HexIcon'

// Styled wrapper around Radix's Select primitive (same family as Dialog/
// DropdownMenu/Tabs) so pickers get themed options and a
// scrollable, height-capped listbox instead of the browser's native <select>
// popup, which can't be styled at all.
interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  // Overrides what the closed trigger shows for the current value (the open
  // list still uses each SelectItem's own children).
  valueLabel?: ReactNode
  disabled?: boolean
  // Extra content under the option list (outside its scroll area), e.g.
  // checkboxes for options that qualify the pick rather than being one.
  footer?: ReactNode
  // Leaves out the trigger's down arrow, for a row of selects too narrow to
  // spare it the width (the phone app's toolbar).
  hideIcon?: boolean
  // A taller list, for long ones (the model and image pickers). Either way
  // it stops at the window's edge.
  tall?: boolean
  /** Optional trigger styling and accessible name for composite controls. */
  triggerClassName?: string
  ariaLabel?: string
  children: ReactNode
}

// How long after a press on the trigger closed the list that the same press
// may not open it again.
const REOPEN_GUARD_MS = 500

export function Select({ value, onValueChange, placeholder, valueLabel, disabled, footer, hideIcon, tall, triggerClassName = '', ariaLabel, children }: SelectProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  // A press on the trigger while the list is open closes it — as an outside
  // press (the trigger isn't part of the list) and, the way Radix handles the
  // rest of that press, also opens it straight back. Opening is refused until
  // this time so the press only closes.
  const reopenGuardUntilRef = useRef(0)

  function closeFromTriggerPress() {
    reopenGuardUntilRef.current = performance.now() + REOPEN_GUARD_MS
    setOpen(false)
  }

  function isOverTrigger(event: Event): boolean {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect || !('clientX' in event)) return false
    const { clientX, clientY } = event as PointerEvent
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
  }

  return (
    <RadixSelect.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      open={open}
      onOpenChange={(next) => {
        if (next && performance.now() < reopenGuardUntilRef.current) return
        setOpen(next)
      }}
    >
      <RadixSelect.Trigger
        ref={triggerRef}
        onPointerDown={(event) => {
          if (!open) return
          event.preventDefault()
          closeFromTriggerPress()
        }}
        className={`flex min-h-8 w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-[var(--hexui-text-secondary)] dark:text-[var(--hexui-text-secondary-dark)] outline-none ring ring-inset ring-neutral-200 focus:ring-[var(--hexui-accent-solid)] disabled:opacity-40 dark:bg-neutral-950 dark:ring-neutral-700 dark:focus:ring-[var(--hexui-accent-solid-dark)] ${triggerClassName}`}
        aria-label={ariaLabel ?? placeholder}
      >
        <RadixSelect.Value placeholder={placeholder}>{valueLabel}</RadixSelect.Value>
        {!hideIcon && (
          <RadixSelect.Icon className="text-neutral-400">
            <HexIcon name="chevronDown" width={14} height={14} />
          </RadixSelect.Icon>
        )}
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          // AppDialog deliberately prevents its own outside-pointer event so
          // a portalled Select cannot dismiss the whole dialog. Radix layers
          // share that cancelable event, which also suppresses Select's
          // built-in dismissal. Close explicitly before the outer layer can
          // cancel the event: clicking dialog content then folds only Select.
          onPointerDownOutside={(event) => {
            if (isOverTrigger(event.detail.originalEvent)) closeFromTriggerPress()
            else setOpen(false)
          }}
          // At least as wide as the trigger, wider when an option needs it
          // (up to 28rem, and never past the window's edge), so a long
          // option isn't squeezed into a narrow trigger's width.
          className={`z-50 ${tall ? 'max-h-[min(30rem,var(--radix-select-content-available-height))]' : 'max-h-64'} w-max min-w-[var(--radix-select-trigger-width)] max-w-[min(28rem,var(--radix-select-content-available-width))] overflow-hidden rounded-md bg-white text-sm shadow-lg ring ring-inset ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800`}
        >
          {/* A plain scrollbar on the right, like Combobox's list, instead of
              Radix's scroll-up/down arrow rows. Radix hides its Viewport's
              own scrollbar with a global style, so the inner div, shrunk to
              whatever the capped Content leaves beside the footer, does the
              scrolling; keyboard focus scrolls it like any other container. */}
          <RadixSelect.Viewport className="flex flex-col">
            <div className="min-h-0 overflow-y-auto p-1">{children}</div>
          </RadixSelect.Viewport>
          {footer && <div className="border-t border-neutral-200 p-1 dark:border-neutral-800">{footer}</div>}
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

export function SelectItem({
  value,
  children,
  disabled,
  action,
}: {
  value: string
  children: ReactNode
  disabled?: boolean
  // Control on the option's right edge (e.g. a download button). Rendered
  // outside the item text so it never leaks into the closed trigger, and its
  // pointer/key events stop here so using it does not pick the option.
  action?: ReactNode
}) {
  return (
    <RadixSelect.Item
      value={value}
      disabled={disabled}
      className="flex cursor-pointer select-none items-center justify-between gap-2 rounded px-2.5 py-1.5 text-sm text-[var(--hexui-text-secondary)] dark:text-[var(--hexui-text-secondary-dark)] outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 data-[highlighted]:bg-neutral-100 dark:data-[highlighted]:bg-neutral-800"
    >
      <span className="min-w-0 break-words">
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      </span>
      <RadixSelect.ItemIndicator className="ml-auto flex items-center text-[var(--hexui-accent-solid)] dark:text-[var(--hexui-accent-text-dark)]">
        <HexIcon name="check" width={16} height={16} />
      </RadixSelect.ItemIndicator>
      {action && (
        <span
          className="flex shrink-0 items-center"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          {action}
        </span>
      )}
    </RadixSelect.Item>
  )
}
