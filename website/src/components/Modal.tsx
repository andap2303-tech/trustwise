import { useEffect, useRef, type ReactNode } from 'react'

/** Accessible dialog (native <dialog>): Esc and backdrop click close it. */
export default function Modal({
  open,
  onClose,
  eyebrow,
  title,
  body,
  children,
}: {
  open: boolean
  onClose: () => void
  eyebrow?: string
  title: string
  body: string
  /** Action buttons */
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-card bg-white p-0 shadow-lift backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
      aria-labelledby="modal-title"
    >
      <div className="space-y-5 p-8">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 id="modal-title" className="text-2xl font-semibold">{title}</h2>
        <p className="text-[15px] leading-relaxed text-ink-soft">{body}</p>
        <div className="grid gap-3">{children}</div>
      </div>
    </dialog>
  )
}
