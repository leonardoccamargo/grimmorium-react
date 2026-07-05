import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import heroImage from '../assets/spellbook-hero.jpg'

export default function HomePage() {
  const { language } = useLanguage()
  const classBelt = ['Bárbaro', 'Bardo', 'Bruxo', 'Clérigo', 'Druida', 'Feiticeiro', 'Guerreiro', 'Ladino', 'Mago', 'Monge', 'Paladino', 'Patrulheiro']

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  const strings = {
    heroKicker: language === 'pt-br' ? 'Página inicial' : 'Home',
    heroHeadingTop: language === 'pt-br' ? 'Tudo o que você precisa' : 'Everything you need',
    heroHeadingBottom: language === 'pt-br' ? 'para a sua próxima aventura!' : 'for your next adventure!',
    heroText: language === 'pt-br'
      ? 'Crie personagens de D&D 5e, acompanhe vida e recursos na sessão e consulte magias do grimório em um só lugar.'
      : 'Create D&D 5e characters, track HP and resources in-session, and browse spells in one place.',
    ctaPrimary: language === 'pt-br' ? 'Criar personagem' : 'Create character',
    ctaSecondary: language === 'pt-br' ? 'Abrir grimório' : 'Open spellbook',
    pill1: language === 'pt-br' ? 'Criação rápida' : 'Quick setup',
    pill2: language === 'pt-br' ? 'Sessão em andamento' : 'Session ready',
    pill3: language === 'pt-br' ? 'Consulta simples' : 'Easy lookup',
    pill4: language === 'pt-br' ? 'Rolagens integradas' : 'Integrated rolls',
    stat1Label: language === 'pt-br' ? 'Classes' : 'Classes',
    stat2Label: language === 'pt-br' ? 'Magias' : 'Spells',
    stat3Label: language === 'pt-br' ? 'Compatível' : 'Compatible',
    pillarsKicker: language === 'pt-br' ? 'O que o Grimmorium faz' : 'What Grimmorium does',
    pillarsTitleLead: language === 'pt-br' ? 'Três pilares' : 'Three pillars',
    pillarsTitleTail: language === 'pt-br' ? ' de toda mesa' : ' for every table',
    card1Title: language === 'pt-br' ? 'Crie e edite personagens' : 'Create and edit characters',
    card1Text: language === 'pt-br'
      ? 'Monte fichas completas em poucos passos e ajuste quando quiser.'
      : 'Build your sheet in a few steps and update it anytime.',
    card2Title: language === 'pt-br' ? 'Acompanhe sua sessão' : 'Track your session',
    card2Text: language === 'pt-br'
      ? 'Atualize vida, recursos e progresso em tempo real durante o jogo.'
      : 'Update HP, resources, and progress while you play.',
    card3Title: language === 'pt-br' ? 'Consulte o grimório' : 'Browse the spellbook',
    card3Text: language === 'pt-br'
      ? 'Encontre magias por nível e mantenha o ritmo da aventura.'
      : 'Find spells quickly to keep the adventure moving.',
    cardAction: language === 'pt-br' ? 'Acessar' : 'Open',
    classesKicker: language === 'pt-br' ? 'Suporte completo' : 'Full support',
    classesTitle: language === 'pt-br' ? '12 classes do Livro do Jogador' : '12 Player Handbook classes',
    classesText: language === 'pt-br'
      ? 'De guerreiros a magos, todas as classes principais estão prontas para sua campanha.'
      : 'From warriors to wizards, all core classes are ready for your campaign.',
  }

  const features = [
    { n: 'I', title: strings.card1Title, text: strings.card1Text, icon: 'sword', href: '/personagens' },
    { n: 'II', title: strings.card2Title, text: strings.card2Text, icon: 'shield', href: '/jogar' },
    { n: 'III', title: strings.card3Title, text: strings.card3Text, icon: 'scroll', href: '/grimorio' },
  ]

  function renderFeatureIcon(icon) {
    if (icon === 'sword') return <SwordIcon />
    if (icon === 'shield') return <ShieldIcon />
    return <ScrollIcon />
  }

  return (
    <main className="home-page-shell">

      <section className="hero-arcano home-hero">
        <CornerFlourish className="home-corner top-left" />
        <CornerFlourish className="home-corner top-right" />
        <CornerFlourish className="home-corner bottom-left" />
        <CornerFlourish className="home-corner bottom-right" />

        <div className="hero-conteudo">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <span className="home-kicker"><StarIcon /> {strings.heroKicker}</span>
              <h1>
                <span className="text-gold-gradient">{strings.heroHeadingTop}</span>
                <span className="home-hero-subline">{strings.heroHeadingBottom}</span>
              </h1>
              <p className="hero-lead">{strings.heroText}</p>

              <dl className="home-stats">
                <div>
                  <dt>12</dt>
                  <dd>{strings.stat1Label}</dd>
                </div>
                <div>
                  <dt>300+</dt>
                  <dd>{strings.stat2Label}</dd>
                </div>
                <div>
                  <dt>5e</dt>
                  <dd>{strings.stat3Label}</dd>
                </div>
              </dl>
            </div>

            <aside className="home-hero-panel" aria-label={language === 'pt-br' ? 'Imagem principal' : 'Main image'}>
              <div className="home-hero-glow" />
              <div className="home-hero-image-frame">
                <img
                  src={heroImage}
                  alt={language === 'pt-br' ? 'Grimório com runas douradas' : 'Spellbook with golden runes'}
                  className="home-hero-image"
                />
                <div className="home-hero-image-overlay" />
                <div className="home-floating-rune"><RuneCircle /></div>
              </div>

              <div className="home-hero-actions">
                <div className="home-pill-row" aria-label={language === 'pt-br' ? 'Destaques rápidos' : 'Quick highlights'}>
                  <span className="home-pill">{strings.pill1}</span>
                  <span className="home-pill">{strings.pill2}</span>
                  <span className="home-pill">{strings.pill3}</span>
                  <span className="home-pill">{strings.pill4}</span>
                </div>

                <div className="home-cta-row">
                  <Link to="/personagens" className="home-btn home-btn-primary"><FlameIcon /> {strings.ctaPrimary}</Link>
                  <Link to="/grimorio" className="home-btn home-btn-ghost">{strings.ctaSecondary}</Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="home-pillars">
        <div className="home-pillars-head">
          <div className="home-pillars-intro">
            <p>✦ {strings.pillarsKicker}</p>
            <h3>
              <span className="text-gold-gradient">{strings.pillarsTitleLead}</span>
              <span className="home-pillars-title-tail">{strings.pillarsTitleTail}</span>
            </h3>
          </div>
          <div className="home-pillars-divider" aria-hidden="true" />
        </div>

        <div className="hero-cards">
          {features.map((feature) => (
            <article key={feature.n} className="hero-card" tabIndex={0}>
              <span className="hero-card-index">{feature.n}</span>
              <div className="hero-card-icon">{renderFeatureIcon(feature.icon)}</div>
              <h4>{feature.title}</h4>
              <p>{feature.text}</p>
              <Link to={feature.href} className="hero-card-link" aria-label={`${strings.cardAction} - ${feature.title}`} onClick={scrollToTop}>
                {strings.cardAction} <ArrowIcon />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-classes-belt">
        <div className="home-classes-head">
          <div>
            <p>{strings.classesKicker}</p>
            <h3><span className="text-gold-gradient">12 classes</span> {strings.classesTitle.replace(/^12 classes\s*/i, '')}</h3>
          </div>
          <p>{strings.classesText}</p>
        </div>
        <div className="home-class-chips">
          {classBelt.map((className) => (
            <span key={className}>{className}</span>
          ))}
        </div>
      </section>
    </main>
  )
}

function CornerFlourish({ className = '' }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 20 V6 A4 4 0 0 1 6 2 H20" />
      <path d="M8 14 L14 8" />
      <circle cx="14" cy="14" r="1.5" fill="currentColor" />
    </svg>
  )
}

function RuneCircle({ large = false }) {
  const size = large ? 600 : 180
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <polygon points="100,25 165,140 35,140" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <polygon points="100,175 35,60 165,60" fill="none" stroke="currentColor" strokeWidth="0.5" />
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2
        const x1 = 100 + Math.cos(angle) * 82
        const y1 = 100 + Math.sin(angle) * 82
        const x2 = 100 + Math.cos(angle) * 90
        const y2 = 100 + Math.sin(angle) * 90
        return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.6" />
      })}
    </svg>
  )
}

function SwordIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
      <path d="M13 19l6-6" />
      <path d="M16 16l4 4" />
      <path d="M19 21l2-2" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function ScrollIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3h11a2 2 0 0 1 2 2v3H8z" />
      <path d="M19 21H6a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3" />
      <path d="M8 12h9M8 16h6" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
      <path d="M12 2l2 7h7l-5.7 4.2L17.5 22 12 17.6 6.5 22l2.2-8.8L3 9h7z" />
    </svg>
  )
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 2s5 5 5 10a5 5 0 1 1-10 0c0-2 1-3 2-4-1 3 1 4 2 4 0-3-2-4 1-10z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
