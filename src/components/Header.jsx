import { NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import Tooltip from './Tooltip.jsx'

export default function Header({ theme, onToggleTheme }) {
  const location = useLocation()
  const { language, toggleLanguage } = useLanguage()

  const strings = {
    title: language === 'pt-br' ? 'Atlas Arcano' : 'Arcane Atlas',
    subtitle: language === 'pt-br'
      ? 'Gerencie fichas de RPG e controle sua campanha em tempo real.'
      : 'Manage RPG sheets and track your campaign in real time.',
    navHome: language === 'pt-br' ? 'Início' : 'Home',
    navCharacters: language === 'pt-br' ? 'Personagens' : 'Characters',
    navSpellbook: language === 'pt-br' ? 'Grimório' : 'Spellbook',
    breadcrumbPrefix: language === 'pt-br' ? 'Você está em:' : 'You are at:',
    themeToggle: language === 'pt-br'
      ? (theme === 'light' ? 'Tema Escuro' : 'Tema Claro')
      : (theme === 'light' ? 'Dark Mode' : 'Light Mode'),
    languageToggle: language === 'pt-br' ? 'Alternar idioma' : 'Toggle language',
  }

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
              {strings.themeToggle}
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
              {language === 'pt-br' ? 'PT-BR' : 'EN'}
            </button>
          </Tooltip>
        </div>
      </div>

      <nav className="menu-arcano" aria-label={language === 'pt-br' ? 'Menu principal' : 'Main menu'}>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'is-active' : ''}>{strings.navHome}</NavLink>
        <NavLink to="/personagens" className={({ isActive }) => isActive ? 'is-active' : ''}>{strings.navCharacters}</NavLink>
        <NavLink to="/grimorio" className={({ isActive }) => isActive ? 'is-active' : ''}>{strings.navSpellbook}</NavLink>
      </nav>

      <div className="breadcrumb">{strings.breadcrumbPrefix} <strong>{location.pathname}</strong></div>
    </header>
  )
}
