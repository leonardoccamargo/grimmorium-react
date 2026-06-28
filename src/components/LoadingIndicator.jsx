import { useLanguage } from '../context/LanguageContext.jsx'

export default function LoadingIndicator({ message }) {
  const { language } = useLanguage()
  const defaultMessage = language === 'pt-br' ? 'Carregando...' : 'Loading...'

  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span>{message || defaultMessage}</span>
    </div>
  )
}
