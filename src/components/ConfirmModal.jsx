import { useEffect, useId, useRef } from 'react'

export default function ConfirmModal({
  isOpen,
  title,
  message,
  cancelLabel,
  confirmLabel,
  extraActionLabel,
  onExtraAction,
  extraActionClassName = 'btn-primary',
  onCancel,
  onConfirm,
}) {
  const cancelButtonRef = useRef(null)
  const titleId = useId()
  const messageId = useId()

  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    const previousOverflow = document.body.style.overflow
    const previousActiveElement = document.activeElement
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeydown)
    cancelButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeydown)
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus()
      }
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id={titleId}>{title}</h3>
        <p id={messageId}>{message}</p>

        <div className="modal-actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="btn-secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          {extraActionLabel && onExtraAction && (
            <button type="button" className={extraActionClassName} onClick={onExtraAction}>
              {extraActionLabel}
            </button>
          )}
          <button type="button" className="btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
