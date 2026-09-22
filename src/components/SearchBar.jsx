import { useId } from 'react'
import { Search } from 'lucide-react'
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
  expandable = false,
  expanded = true,
  onToggleExpanded,
  iconOnly = false,
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
    <form className={`search-bar ${iconOnly ? 'search-bar-icon-only' : ''} ${expandable ? 'search-bar-expandable' : ''} ${expanded ? 'search-bar-expanded' : 'search-bar-collapsed'}`} onSubmit={onSubmit ?? ((event) => event.preventDefault())}>
      {(!expandable || expanded) && (
        <div className="search-bar-field">
        <Search className="search-bar-icon" size={16} strokeWidth={2} aria-hidden="true" />
        <label htmlFor={resolvedInputId} className="visually-hidden">{labels.aria}</label>
        <input
          id={resolvedInputId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={labels.placeholder}
          aria-label={labels.aria}
          autoFocus={expandable && expanded}
        />
        </div>
      )}
      <button
        type={expandable && !expanded ? 'button' : 'submit'}
        className="btn-secondary search-bar-button"
        onClick={expandable && !expanded ? onToggleExpanded : undefined}
        aria-expanded={expandable ? expanded : undefined}
        aria-label={iconOnly ? labels.button : undefined}
        title={iconOnly ? labels.button : undefined}
      >
        {iconOnly && <Search className="search-button-icon" size={18} strokeWidth={2} aria-hidden="true" />}
        <span className={iconOnly ? 'visually-hidden' : ''}>{labels.button}</span>
      </button>
      {actionOnClick ? (
        <button type="button" className="btn-primary search-bar-action-button" onClick={actionOnClick}>
          {labels.action}
        </button>
      ) : null}
    </form>
  )
}
