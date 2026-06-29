import PageTitle from '../components/PageTitle'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function HomePage() {
  const { language } = useLanguage()

  const strings = {
    title: language === 'pt-br' ? 'Atlas Arcano' : 'Arcane Atlas',
    subtitle: language === 'pt-br' ? 'Painel de gerenciamento de fichas de RPG.' : 'RPG sheet management dashboard.',
    heroHeading: language === 'pt-br' ? 'Bem-vindo ao Atlas Arcano' : 'Welcome to Arcane Atlas',
    heroText: language === 'pt-br'
      ? 'Organize seus personagens, gerencie slots de feitiço e acompanhe sua campanha em tempo real.'
      : 'Organize your characters, manage spell slots, and track your campaign in real time.',
    card1Title: language === 'pt-br' ? 'Gerencie fichas' : 'Manage sheets',
    card1Text: language === 'pt-br'
      ? 'Acompanhe atributos, pontos de vida e slots de feitiço dos seus personagens.'
      : 'Track attributes, hit points, and spell slots for your characters.',
    card2Title: language === 'pt-br' ? 'Rota de jogo' : 'Play route',
    card2Text: language === 'pt-br'
      ? 'Selecione um personagem e abra a ficha para jogar e atualizar seus valores durante a sessão.'
      : 'Select a character and open the sheet to play and update values during the session.',
    card3Title: language === 'pt-br' ? 'Dados simulados' : 'Simulated data',
    card3Text: language === 'pt-br'
      ? 'Simulamos leitura de JSON para representar requisições do servidor e manter o fluxo realista.'
      : 'We simulate JSON reads to represent server requests and keep the flow realistic.',
  }

  return (
    <main>
      <PageTitle title={strings.title} subtitle={strings.subtitle} />
      <section className="hero-arcano home-hero">
        <div className="hero-conteudo">
          <h2>{strings.heroHeading}</h2>
          <p>{strings.heroText}</p>
          <div className="hero-cards">
            <article className="hero-card" tabIndex={0}>
              <h3>{strings.card1Title}</h3>
              <p>{strings.card1Text}</p>
            </article>
            <article className="hero-card" tabIndex={0}>
              <h3>{strings.card2Title}</h3>
              <p>{strings.card2Text}</p>
            </article>
            <article className="hero-card" tabIndex={0}>
              <h3>{strings.card3Title}</h3>
              <p>{strings.card3Text}</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
