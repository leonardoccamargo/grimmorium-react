import PageTitle from '../components/PageTitle'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function NotFoundPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { language } = useLanguage()

  const strings = {
    title: language === 'pt-br' ? '404 - Página não encontrada' : '404 - Page not found',
    subtitle: language === 'pt-br'
      ? 'A rota que você tentou acessar não existe.'
      : 'The route you tried to access does not exist.',
    message: language === 'pt-br'
      ? 'Não foi possível encontrar'
      : 'Could not find',
    buttonLabel: language === 'pt-br' ? 'Voltar para o início' : 'Back to home',
  }

  return (
    <main>
      <PageTitle title={strings.title} subtitle={strings.subtitle} />

      <section className="content-section notfound-section">
        <p>{strings.message} <strong>{location.pathname}</strong>.</p>
        <button type="button" className="btn-primary" onClick={() => navigate('/')}>{strings.buttonLabel}</button>
      </section>
    </main>
  )
}
