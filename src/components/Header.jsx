import { NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import Tooltip from './Tooltip.jsx'

export default function Header({ theme, onToggleTheme }) {
  const location = useLocation()
  const { language, toggleLanguage } = useLanguage()

  const strings = {
    title: language === 'pt-br' ? 'Grimmorium' : 'Grimmorium',
    subtitle: language === 'pt-br'
      ? 'Gerencie fichas de RPG e controle sua campanha em tempo real.'
      : 'Manage RPG sheets and track your campaign in real time.',
    navHome: language === 'pt-br' ? 'Início' : 'Home',
    navCharacters: language === 'pt-br' ? 'Personagens' : 'Characters',
    navSpellbook: language === 'pt-br' ? 'Grimório' : 'Spellbook',
    navSession: language === 'pt-br' ? 'Sessão' : 'Session',
    breadcrumbPrefix: language === 'pt-br' ? 'Você está em:' : 'You are at:',
    themeLabel: language === 'pt-br' ? 'Tema' : 'Theme',
    themeToggle: language === 'pt-br'
      ? (theme === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro')
      : (theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'),
    languageToggle: language === 'pt-br' ? 'Alternar idioma' : 'Toggle language',
  }

  function resolveCurrentPathLabel(pathname) {
    if (pathname === '/') return strings.navHome
    if (pathname.startsWith('/personagens')) return strings.navCharacters
    if (pathname.startsWith('/grimorio')) return strings.navSpellbook
    if (pathname.startsWith('/jogar')) return strings.navSession
    return pathname
  }

  const breadcrumbLabel = resolveCurrentPathLabel(location.pathname)

  return (
    <header className="topo-arcano">
      <div className="topo-conteudo">
        <div>
          <h1 className="titulo-arcano">{strings.title}</h1>
          <p className="subtitulo-arcano">{strings.subtitle}</p>
        </div>

        <div className="header-actions">
          <Tooltip text={strings.themeToggle}>
            <button
              type="button"
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-label={strings.themeToggle}
              title={strings.themeToggle}
            >
              <SunIcon /> {strings.themeLabel}
            </button>
          </Tooltip>
          <Tooltip text={strings.languageToggle}>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleLanguage}
              aria-label={strings.languageToggle}
              title={strings.languageToggle}
            >
              <GlobeIcon /> {language === 'pt-br' ? 'PT-BR' : 'EN'}
            </button>
          </Tooltip>
        </div>
      </div>

      <nav className="menu-arcano" aria-label={language === 'pt-br' ? 'Menu principal' : 'Main menu'}>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'is-active' : ''}>{strings.navHome}</NavLink>
        <NavLink to="/personagens" className={({ isActive }) => isActive ? 'is-active' : ''}>{strings.navCharacters}</NavLink>
        <NavLink to="/grimorio" className={({ isActive }) => isActive ? 'is-active' : ''}>{strings.navSpellbook}</NavLink>
        <span className="menu-placeholder">{strings.navSession}</span>
      </nav>

      <div className="breadcrumb">{strings.breadcrumbPrefix} <strong>/{breadcrumbLabel}</strong></div>
    </header>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  )
}
