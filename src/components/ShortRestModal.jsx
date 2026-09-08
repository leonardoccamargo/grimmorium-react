import { useEffect, useId, useRef, useState } from 'react'

export default function ShortRestModal({
  isOpen,
  availableHitDice,
  onCancel,
  onConfirm,
  title,
  message,
  diceLabel,
  cancelLabel,
  confirmLabel,
}) {
  const [diceCount, setDiceCount] = useState(0)
  const selectRef = useRef(null)
  const titleId = useId()
  const messageId = useId()

  useEffect(() => {
    if (!isOpen) return undefined

    selectRef.current?.focus()

    function handleKeydown(event) {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
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
        <label>
          {diceLabel}
          <select
            ref={selectRef}
            value={diceCount}
            onChange={(event) => setDiceCount(Number(event.target.value))}
          >
            {Array.from({ length: availableHitDice + 1 }, (_, count) => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </label>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn-primary" onClick={() => onConfirm(diceCount)}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
