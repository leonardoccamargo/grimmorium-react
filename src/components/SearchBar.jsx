import { useId } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function SearchBar({
  value,
  onChange,
  placeholder,
  buttonLabel,
  ariaLabel,
  onSubmit,
  actionLabel,
  actionOnClick,
  inputId,
}) {
  const { language } = useLanguage()
  const generatedInputId = useId()
  const resolvedInputId = inputId ?? generatedInputId

  const labels = {
    button: buttonLabel ?? (language === 'pt-br' ? 'Buscar' : 'Search'),
    aria: ariaLabel ?? (language === 'pt-br' ? 'Campo de busca' : 'Search field'),
    placeholder: placeholder ?? (language === 'pt-br' ? 'Buscar...' : 'Search...'),
    action: actionLabel ?? (language === 'pt-br' ? 'Ação' : 'Action'),
  }

  return (
    <form className="search-bar" onSubmit={onSubmit ?? ((event) => event.preventDefault())}>
      <div className="search-bar-field">
        <span className="search-bar-icon" aria-hidden="true">⌕</span>
        <label htmlFor={resolvedInputId} className="visually-hidden">{labels.aria}</label>
        <input
          id={resolvedInputId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={labels.placeholder}
          aria-label={labels.aria}
        />
      </div>
      <button type="submit" className="btn-secondary search-bar-button">{labels.button}</button>
      {actionOnClick ? (
        <button type="button" className="btn-primary search-bar-action-button" onClick={actionOnClick}>
          {labels.action}
        </button>
      ) : null}
    </form>
  )
}
