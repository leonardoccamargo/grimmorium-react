import { useLanguage } from '../context/LanguageContext.jsx'

export default function SearchBar({ value, onChange, placeholder, buttonLabel, ariaLabel, onSubmit }) {
  const { language } = useLanguage()
  const labels = {
    button: buttonLabel ?? (language === 'pt-br' ? 'Buscar' : 'Search'),
    aria: ariaLabel ?? (language === 'pt-br' ? 'Buscar personagem' : 'Search character'),
    placeholder: placeholder ?? (language === 'pt-br' ? 'Buscar por nome ou classe...' : 'Search by name or class...'),
  }

  return (
    <form className="search-bar" onSubmit={onSubmit ?? ((event) => event.preventDefault())}>
      <div className="search-bar-field">
        <span className="search-bar-icon" aria-hidden="true">⌕</span>
        <label htmlFor="character-search" className="visually-hidden">{labels.aria}</label>
        <input
          id="character-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={labels.placeholder}
          aria-label={labels.aria}
        />
      </div>
      <button type="submit" className="btn-secondary search-bar-button">{labels.button}</button>
    </form>
  )
}
