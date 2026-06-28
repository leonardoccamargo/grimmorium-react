import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useLanguage } from './context/LanguageContext.jsx'
import Header from './components/Header.jsx'
import HomePage from './pages/HomePage.jsx'
import PersonagensPage from './pages/PersonagensPage.jsx'
import GrimorioPage from './pages/GrimorioPage.jsx'
import JogarPage from './pages/JogarPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const { language } = useLanguage()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const footerText = language === 'pt-br'
    ? '© 2026 Grimmorium - Pós-Graduação PUC-Rio Digital'
    : '© 2026 Grimmorium - PUC-Rio Digital Graduate Program'

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="container">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/personagens" element={<PersonagensPage />} />
          <Route path="/grimorio" element={<GrimorioPage />} />
          <Route path="/jogar/:id" element={<JogarPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="rodape-arcano">
        <p>{footerText}</p>
      </footer>
    </div>
  )
}
