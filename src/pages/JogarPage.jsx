import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import LoadingIndicator from '../components/LoadingIndicator'
import { useCharacters } from '../context/CharactersContext'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function JogarPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { personagens, status, mensagem, updateCharacter } = useCharacters()
  const [editedValues, setEditedValues] = useState({})

  const modo = searchParams.get('modo') || 'visualizar'
  const isEditar = modo === 'editar'

  const strings = {
    title: language === 'pt-br' ? 'Modo de Jogo' : 'Play Mode',
    subtitle: language === 'pt-br' ? 'Atualize a ficha do personagem em tempo real.' : 'Update the character sheet in real time.',
    loading: language === 'pt-br' ? 'Abrindo ficha...' : 'Opening sheet...',
    notFound: language === 'pt-br'
      ? 'Personagem não encontrado. Volte à lista e selecione outro personagem.'
      : 'Character not found. Return to the list and select another character.',
    editBadge: language === 'pt-br' ? 'Edição' : 'Edit',
    viewBadge: language === 'pt-br' ? 'Visualização' : 'View',
    hpLabel: 'HP',
    acLabel: language === 'pt-br' ? 'Classe de Armadura' : 'Armor Class',
    slots1Label: language === 'pt-br' ? 'Slots 1º nível' : '1st level slots',
    slots2Label: language === 'pt-br' ? 'Slots 2º nível' : '2nd level slots',
    slots3Label: language === 'pt-br' ? 'Slots 3º nível' : '3rd level slots',
    backButton: language === 'pt-br' ? 'Voltar' : 'Back',
    saveButton: language === 'pt-br' ? 'Salvar' : 'Save',
    saveNote: language === 'pt-br'
      ? 'Edite a ficha e depois salve para simular a atualização de valores durante a campanha.'
      : 'Edit the sheet and save after to simulate updating values during the campaign.',
    viewNote: language === 'pt-br'
      ? 'Use o botão Editar na lista de personagens para alterar a ficha.'
      : 'Use the Edit button in the character list to change the sheet.',
  }

  const selecionado = useMemo(() => {
    if (status !== 'success') return null
    return personagens.find((personagem) => String(personagem.id) === String(id)) || null
  }, [status, personagens, id])

  const formValues = useMemo(() => {
    if (!selecionado) return null
    return {
      ...selecionado,
      ...editedValues,
      slots_magia: {
        ...selecionado.slots_magia,
        ...editedValues.slots_magia,
      },
    }
  }, [selecionado, editedValues])

  const handleChange = (field, value) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSlotChange = (slot, value) => {
    setEditedValues((prev) => ({
      ...prev,
      slots_magia: {
        ...prev.slots_magia,
        [slot]: Number(value),
      },
    }))
  }

  const handleVoltar = () => navigate('/personagens')
  const handleSave = () => {
    if (formValues) updateCharacter(formValues)
  }

  const canSave = useMemo(() => {
    return formValues && formValues.hp && formValues.ca != null && formValues.slots_magia
  }, [formValues])

  return (
    <main>
      <PageTitle title={strings.title} subtitle={strings.subtitle} />

      <section className="content-section">
        {status === 'loading' && <LoadingIndicator message={strings.loading} />}
        {status === 'error' && <div className="alert alert-error">{mensagem}</div>}

        {status === 'success' && !selecionado && (
          <div className="alert alert-warning">{strings.notFound}</div>
        )}

        {status === 'success' && selecionado && (
          <div className="play-card">
            <div className="play-card-header">
              <div>
                <h3>{selecionado.nome}</h3>
                <p>{selecionado.classe} · {strings.levelLabel} {selecionado.nivel}</p>
              </div>
              <span className="badge">{isEditar ? strings.editBadge : strings.viewBadge}</span>
            </div>

            <div className="play-fields">
              <label>
                {strings.hpLabel}
                <input
                  type="text"
                  value={formValues.hp}
                  onChange={(event) => handleChange('hp', event.target.value)}
                  disabled={!isEditar}
                />
              </label>

              <label>
                {strings.acLabel}
                <input
                  type="number"
                  value={formValues.ca}
                  onChange={(event) => handleChange('ca', Number(event.target.value))}
                  disabled={!isEditar}
                />
              </label>

              <label>
                {strings.slots1Label}
                <input
                  type="number"
                  value={formValues.slots_magia.nivel1}
                  onChange={(event) => handleSlotChange('nivel1', event.target.value)}
                  disabled={!isEditar}
                />
              </label>

              <label>
                {strings.slots2Label}
                <input
                  type="number"
                  value={formValues.slots_magia.nivel2}
                  onChange={(event) => handleSlotChange('nivel2', event.target.value)}
                  disabled={!isEditar}
                />
              </label>

              <label>
                {strings.slots3Label}
                <input
                  type="number"
                  value={formValues.slots_magia.nivel3}
                  onChange={(event) => handleSlotChange('nivel3', event.target.value)}
                  disabled={!isEditar}
                />
              </label>
            </div>

            <div className="play-actions">
              <button type="button" className="btn-secondary" onClick={handleVoltar}>{strings.backButton}</button>
              <button type="button" className="btn-primary" onClick={handleSave} disabled={!isEditar || !canSave}>{strings.saveButton}</button>
            </div>

            <div className="play-note">
              {isEditar ? strings.saveNote : strings.viewNote}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
