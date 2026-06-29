import { useEffect } from 'react'

export default function ConfirmModal({
  isOpen,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeydown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="confirm-modal-title">{title}</h3>
        <p id="confirm-modal-message">{message}</p>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
