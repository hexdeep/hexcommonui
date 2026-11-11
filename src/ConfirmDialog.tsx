import { useState, type ReactNode } from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Button } from './Button'
import { Checkbox } from './Checkbox'
import { inputClass } from './Input'

export interface ConfirmDialogProps {
  message: ReactNode
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
  /** The button texts; HexUI carries no translations. */
  cancelLabel: string
  confirmLabel: string
  // Asks for the sum of two random numbers from 1 to 10 before confirming:
  // something to stop and think over, not just click through. Needs
  // challengeLabel to word the question.
  challenge?: boolean
  challengeLabel?: (a: number, b: number) => string
  // An extra checkbox under the message, e.g. "don't ask again"; its state
  // is the caller's.
  option?: { label: string; checked: boolean; onChange: (checked: boolean) => void }
}

function randomAddend(): number {
  return Math.floor(Math.random() * 10) + 1
}

// A themed replacement for the browser's confirm() (Radix AlertDialog): it
// doesn't block the JS thread and matches the rest of the app.
export function ConfirmDialog({ message, onConfirm, onCancel, danger, cancelLabel, confirmLabel, challenge, challengeLabel, option }: ConfirmDialogProps) {
  const [addends] = useState(() => [randomAddend(), randomAddend()] as const)
  const [answer, setAnswer] = useState('')
  const solved = !challenge || Number(answer.trim()) === addends[0] + addends[1]
  const text = 'text-sm text-neutral-700 dark:text-neutral-200'
  return (
    <AlertDialog.Root open onOpenChange={(open) => !open && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <AlertDialog.Content
            onClick={(e) => e.stopPropagation()}
            className="w-80 max-w-full rounded-lg bg-white p-4 shadow-lg ring-1 ring-inset ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800"
          >
            <AlertDialog.Description className={text}>{message}</AlertDialog.Description>
            {option && (
              <label className={`mt-3 flex cursor-pointer items-center gap-2 ${text}`}>
                <Checkbox checked={option.checked} onChange={(event) => option.onChange(event.target.checked)} />
                {option.label}
              </label>
            )}
            {challenge && (
              <form
                className="mt-3 flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (solved) onConfirm()
                }}
              >
                <label htmlFor="confirm-dialog-answer" className="text-sm font-medium text-red-600 dark:text-red-400">
                  {challengeLabel?.(addends[0], addends[1]) ?? `${addends[0]} + ${addends[1]} = ?`}
                </label>
                <input
                  id="confirm-dialog-answer"
                  autoFocus
                  inputMode="numeric"
                  autoComplete="off"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className={`${inputClass} h-8`}
                />
              </form>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <AlertDialog.Cancel asChild>
                <Button onClick={onCancel}>{cancelLabel}</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button variant={danger ? 'danger' : 'primary'} disabled={!solved} onClick={onConfirm}>
                  {confirmLabel}
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
