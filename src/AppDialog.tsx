import { useRef, type ComponentPropsWithoutRef, type ReactNode, type Ref } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { HexIcon } from './HexIcon'

type AppDialogProps = {
  /** Plain title used by ordinary dialogs. */
  title: string
  /**
   * Replaces the plain title when supplied, for headers needing structured
   * content such as a title plus metadata. Include a Dialog.Title inside the
   * node so the custom header retains Radix's accessible title semantics.
   */
  titleContent?: ReactNode
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
  className?: string
  bodyClassName?: string
  /** Use a bottom sheet on mobile while preserving the desktop dialog. */
  drawer?: boolean
  /** Close when the dimmed backdrop is pressed. Defaults to true. */
  closeOnOverlayClick?: boolean
}

type AppDialogContentProps = ComponentPropsWithoutRef<typeof Dialog.Content> & {
  /** Internal layout hook used by AppDialog; ordinary consumers need none. */
  wrapperClassName?: string
  /** Internal ref used to distinguish a real backdrop press from portal retargeting. */
  contentRef?: Ref<HTMLDivElement>
}

export function AppDialogContent({
  className = '',
  children,
  wrapperClassName = 'items-center p-4',
  contentRef,
  ...props
}: AppDialogContentProps) {
  // Radix's nested Select/Dropdown layers need events to reach document to
  // dismiss. Sortable/marquee ancestors must ignore portal targets outside
  // their own DOM subtree instead of stopping events at this modal boundary.
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center ${wrapperClassName}`}
    >
      <Dialog.Content
        ref={contentRef}
        aria-describedby={undefined}
        {...props}
        className={`!static !translate-x-0 !translate-y-0 ${className}`}
      >
        {children}
      </Dialog.Content>
    </div>
  )
}

export function AppDialog({
  title,
  titleContent,
  children,
  footer,
  onClose,
  className = 'w-[36rem]',
  bodyClassName = '',
  drawer = false,
  closeOnOverlayClick = true,
}: AppDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          onClick={(event) => {
            // Radix Select renders in a portal and temporarily disables
            // pointer events outside that list. During that transition, a
            // click visibly inside the dialog can be retargeted to Overlay.
            // Geometry is the reliable distinction between that case and a
            // genuine click on the dimmed area.
            const rect = contentRef.current?.getBoundingClientRect()
            if (rect && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) return
            if (closeOnOverlayClick) onClose()
          }}
          className="fixed inset-0 z-50 bg-black/50"
        />
        <AppDialogContent
          contentRef={contentRef}
          wrapperClassName={drawer ? 'items-end p-0 md:items-center md:p-4' : undefined}
          // A Select/Dropdown portal is outside Dialog.Content in the DOM.
          // Never let Radix's generic outside-pointer path close this dialog;
          // the real Overlay above is the single explicit close target.
          onPointerDownOutside={(event) => event.preventDefault()}
          // Likewise focus landing outside: a menu that closes hands focus
          // back to its trigger, which may sit outside this dialog.
          onFocusOutside={(event) => event.preventDefault()}
          // Radix sees Escape first (a capturing document listener), so a
          // field that uses Escape itself — cancelling an edit, say — marks
          // itself data-own-escape to keep the dialog open.
          onEscapeKeyDown={(event) => {
            if (event.target instanceof Element && event.target.closest('[data-own-escape]')) event.preventDefault()
          }}
          // Radix focuses the dialog's first focusable element on open, which is
          // the close button in the title bar, and that beats a field's own
          // autoFocus. A field marked data-autofocus gets the focus instead,
          // with its text selected so an existing value can be typed over.
          // The event's own target is the content element: contentRef is not
          // attached yet when Radix fires this on mount.
          onOpenAutoFocus={(event) => {
            const target = (event.currentTarget as HTMLElement | null)?.querySelector<HTMLElement>('[data-autofocus]')
            if (!target) return
            event.preventDefault()
            target.focus()
            if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) target.select()
          }}
          className={`flex max-h-[calc(100vh-2rem)] max-w-full flex-col overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-inset ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800 ${drawer ? 'max-md:!w-full max-md:max-h-[85dvh] max-md:rounded-t-2xl max-md:rounded-b-none max-md:border-x-0 max-md:border-b-0' : ''} ${className}`}
        >
            {drawer && <div aria-hidden className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600 md:hidden" />}
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
              {titleContent ?? <Dialog.Title className="text-base font-medium">{title}</Dialog.Title>}
              <Dialog.Close className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                <HexIcon name="close" width={16} height={16} />
              </Dialog.Close>
            </div>
            <div className={`min-h-0 overflow-y-auto ${bodyClassName}`}>{children}</div>
            {footer && <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-neutral-100 px-5 py-3 dark:border-neutral-800">{footer}</div>}
        </AppDialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
