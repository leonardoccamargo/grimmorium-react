import { NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import logo from '../assets/grimmorium-logo.svg'

export default function Header({ theme, onToggleTheme, isDockOpen, onToggleDock, onCloseDock }) {
  const { language, toggleLanguage } = useLanguage()
  const { pathname } = useLocation()

  const strings = {
    title: language === 'pt-br' ? 'Grimmorium' : 'Grimmorium',
    subtitle: language === 'pt-br'
      ? 'Gerencie fichas de RPG e controle sua campanha em tempo real.'
      : 'Manage RPG sheets and track your campaign in real time.',
    navHome: language === 'pt-br' ? 'Início' : 'Home',
    navCharacters: language === 'pt-br' ? 'Personagens' : 'Characters',
    navSpellbook: language === 'pt-br' ? 'Grimório' : 'Spellbook',
    navSession: language === 'pt-br' ? 'Sessão' : 'Session',
    themeLabel: language === 'pt-br' ? 'Tema' : 'Theme',
    themeToggle: language === 'pt-br'
      ? (theme === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro')
      : (theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'),
    languageToggle: language === 'pt-br' ? 'Alternar idioma' : 'Toggle language',
  }

  const pageTitle = pathname === '/personagens'
    ? strings.navCharacters
    : pathname === '/grimorio'
      ? strings.navSpellbook
      : pathname.startsWith('/jogar')
        ? strings.navSession
        : pathname === '/'
          ? ''
          : (language === 'pt-br' ? 'Página não encontrada' : 'Page not found')

  const navItems = [
    { to: '/', label: strings.navHome, icon: <HomeIcon /> },
    { to: '/personagens', label: strings.navCharacters, icon: <UsersIcon /> },
    { to: '/grimorio', label: strings.navSpellbook, icon: <BookIcon /> },
    { to: '/jogar', label: strings.navSession, icon: <DiceIcon /> },
  ]

  return (
    <>
      <header className="topo-arcano">
        <div className="brand-block">
          <NavLink to="/" className="brand-link" aria-label={strings.navHome} onClick={onCloseDock}>
            <img
              src={logo}
              alt="Logo Grimmorium"
              className="header-logo"
            />
            <div>
              <h1 className="titulo-arcano">{strings.title}</h1>
              <p className="subtitulo-arcano">{strings.subtitle}</p>
            </div>
          </NavLink>
        </div>

        {pageTitle && <h2 className="header-page-title">{pageTitle}</h2>}

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle icon-only"
            onClick={onToggleTheme}
            aria-label={strings.themeToggle}
            title={strings.themeToggle}
          >
            <SunIcon />
          </button>
          <button
            type="button"
            className="theme-toggle icon-only"
            onClick={toggleLanguage}
            aria-label={strings.languageToggle}
            title={strings.languageToggle}
          >
            <GlobeIcon />
          </button>
        </div>
      </header>

      <aside className={`header-dock ${isDockOpen ? 'is-open' : ''}`} aria-label={language === 'pt-br' ? 'Menu principal' : 'Main menu'}>
        <button
          type="button"
          className="dock-toggle"
          onClick={onToggleDock}
          aria-expanded={isDockOpen}
          aria-label={isDockOpen ? (language === 'pt-br' ? 'Fechar menu' : 'Close menu') : (language === 'pt-br' ? 'Abrir menu' : 'Open menu')}
        >
          <span className="dock-indicator"><HamburgerIcon /></span>
          <span className="dock-text">{language === 'pt-br' ? 'Menu' : 'Menu'}</span>
        </button>

        <nav className="menu-arcano" aria-label={language === 'pt-br' ? 'Menu principal' : 'Main menu'}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onCloseDock}
              className={({ isActive }) => isActive ? 'is-active' : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
      <circle cx="10" cy="7" r="3.5" />
      <path d="M22 19v-1a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M4 5.5V19" />
      <path d="M8 7h8M8 11h8" />
    </svg>
  )
}

function DiceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="15" r="1.5" fill="currentColor" stroke="none" />
    </svg>
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

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  )
}
