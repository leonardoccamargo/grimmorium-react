/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('preferredLanguage') || 'pt-br')

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'pt-br' ? 'en' : 'pt-br'))
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
