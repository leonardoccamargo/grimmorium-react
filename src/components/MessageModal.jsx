import { useEffect, useId, useRef } from 'react'

export default function MessageModal({
  isOpen,
  title,
  message,
  buttonLabel,
  onClose,
}) {
  const buttonRef = useRef(null)
  const titleId = useId()
  const messageId = useId()

  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    const previousActiveElement = document.activeElement
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeydown)
    buttonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeydown)
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
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
          <button ref={buttonRef} type="button" className="btn-primary" onClick={onClose}>
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
