import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import LoadingIndicator from '../components/LoadingIndicator'
import ConfirmModal from '../components/ConfirmModal'
import MessageModal from '../components/MessageModal'
import { useCharacters } from '../context/CharactersContext'
import { useLanguage } from '../context/LanguageContext.jsx'
import { clampHpToMax, parseHpString, formatHpString } from '../utils/characterHealth.js'

export default function JogarPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { personagens, status, mensagem, updateCharacter } = useCharacters()
  const [editedValues, setEditedValues] = useState({})
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const [showSavedModal, setShowSavedModal] = useState(false)

  const strings = {
    title: language === 'pt-br' ? 'Modo de Jogo' : 'Play Mode',
    subtitle: language === 'pt-br' ? 'Atualize a ficha do personagem em tempo real.' : 'Update the character sheet in real time.',
    loading: language === 'pt-br' ? 'Abrindo ficha...' : 'Opening sheet...',
    notFound: language === 'pt-br'
      ? 'Personagem não encontrado. Volte à lista e selecione outro personagem.'
      : 'Character not found. Return to the list and select another character.',
    playBadge: language === 'pt-br' ? 'Jogo' : 'Play',
    levelLabel: language === 'pt-br' ? 'Nível' : 'Level',
    hpLabel: 'HP',
    acLabel: language === 'pt-br' ? 'Classe de Armadura' : 'Armor Class',
    slots1Label: language === 'pt-br' ? 'Slots 1º nível' : '1st level slots',
    slots2Label: language === 'pt-br' ? 'Slots 2º nível' : '2nd level slots',
    slots3Label: language === 'pt-br' ? 'Slots 3º nível' : '3rd level slots',
    backButton: language === 'pt-br' ? 'Voltar' : 'Back',
    saveButton: language === 'pt-br' ? 'Salvar' : 'Save',
    playNote: language === 'pt-br'
      ? 'Use os botões de ajuste para alterar os valores do personagem durante a partida.'
      : 'Use the adjustment buttons to change the character values during the session.',
    hpCurrentLabel: language === 'pt-br' ? 'HP atual' : 'Current HP',
    increase: language === 'pt-br' ? 'Aumentar' : 'Increase',
    decrease: language === 'pt-br' ? 'Diminuir' : 'Decrease',
    unsavedTitle: language === 'pt-br' ? 'Alterações não salvas' : 'Unsaved changes',
    unsavedMessage: language === 'pt-br'
      ? 'Você fez alterações que ainda não foram salvas. Deseja sair sem salvar?'
      : 'You have unsaved changes. Do you want to leave without saving?',
    stayButton: language === 'pt-br' ? 'Continuar editando' : 'Continue editing',
    leaveButton: language === 'pt-br' ? 'Sair sem salvar' : 'Leave without saving',
    savedTitle: language === 'pt-br' ? 'Salvamento concluído' : 'Save completed',
    savedMessage: language === 'pt-br'
      ? 'As alterações foram salvas com sucesso.'
      : 'The changes were saved successfully.',
    closeButton: language === 'pt-br' ? 'Fechar' : 'Close',
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
    if (formValues) {
      const { current, max } = parseHpString(formValues.hp)
      updateCharacter({
        ...formValues,
        hp: formatHpString(clampHpToMax(current, max), max),
      })
    }
    setEditedValues({})
    setShowSavedModal(true)
  }

  const parseHp = (hpValue) => {
    const [currentValue = '0', maxValue = '0'] = String(hpValue ?? '0/0').split('/')
    const current = Number(currentValue)
    const max = Number(maxValue)

    return {
      current: Number.isFinite(current) ? current : 0,
      max: Number.isFinite(max) ? max : 0,
    }
  }

  const formatHp = (current, max) => `${Math.max(0, current)}/${Math.max(0, max)}`

  const adjustHp = (delta) => {
    if (!formValues) return

    const { current, max } = parseHp(formValues.hp)
    handleChange('hp', formatHp(clampHpToMax(current + delta, max), max))
  }

  const adjustNumberField = (field, delta, minimum = 0) => {
    if (!formValues) return
    const currentValue = Number(formValues[field]) || 0
    handleChange(field, Math.max(minimum, currentValue + delta))
  }

  const adjustSlot = (slot, delta) => {
    if (!formValues) return
    const currentValue = Number(formValues.slots_magia[slot]) || 0
    handleSlotChange(slot, Math.max(0, currentValue + delta))
  }

  const canSave = useMemo(() => {
    return formValues && formValues.hp && formValues.ca != null && formValues.slots_magia
  }, [formValues])

  const hasUnsavedChanges = Object.keys(editedValues).length > 0

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedModal(true)
      return
    }

    handleVoltar()
  }

  const confirmLeaveWithoutSaving = () => {
    setShowUnsavedModal(false)
    setEditedValues({})
    handleVoltar()
  }

  const clampInputValue = (fieldValue, maxValue, minValue = 0) => {
    const parsedValue = Number(fieldValue) || 0
    return Math.min(Math.max(parsedValue, minValue), maxValue)
  }

  const limitHpInput = (rawValue) => {
    if (!formValues) return

    const { current, max } = parseHpString(formValues.hp)
    const [currentPart = '0'] = String(rawValue ?? '0/0').split('/')
    const parsedCurrent = Number(currentPart)
    const resolvedCurrent = clampHpToMax(Number.isFinite(parsedCurrent) ? parsedCurrent : current, max)

    handleChange('hp', formatHpString(resolvedCurrent, max))
  }

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
              <span className="badge">{strings.playBadge}</span>
            </div>

            <div className="play-fields">
              <div className="play-control-group">
                <span className="play-control-label">{strings.hpLabel}</span>
                <div className="play-control-row">
                  <button type="button" className="btn-secondary play-step-button" onClick={() => adjustHp(-1)}>{strings.decrease}</button>
                  <label>
                    {strings.hpCurrentLabel}
                    <input
                      type="text"
                      value={formValues.hp}
                      onChange={(event) => handleChange('hp', event.target.value)}
                      onBlur={(event) => limitHpInput(event.target.value)}
                    />
                  </label>
                  <button type="button" className="btn-secondary play-step-button" onClick={() => adjustHp(1)}>{strings.increase}</button>
                </div>
              </div>

              <div className="play-control-group">
                <span className="play-control-label">{strings.acLabel}</span>
                <div className="play-control-row">
                  <button type="button" className="btn-secondary play-step-button" onClick={() => adjustNumberField('ca', -1)}>{strings.decrease}</button>
                  <label>
                    {strings.acLabel}
                    <input
                      type="number"
                      value={formValues.ca}
                      onChange={(event) => handleChange('ca', clampInputValue(event.target.value, 99, 0))}
                    />
                  </label>
                  <button type="button" className="btn-secondary play-step-button" onClick={() => adjustNumberField('ca', 1)}>{strings.increase}</button>
                </div>
              </div>

              <div className="play-control-group">
                <span className="play-control-label">{strings.slots1Label}</span>
                <div className="play-control-row">
                  <button type="button" className="btn-secondary play-step-button" onClick={() => adjustSlot('nivel1', -1)}>{strings.decrease}</button>
                  <label>
                    {strings.slots1Label}
                    <input
                      type="number"
                      value={formValues.slots_magia.nivel1}
                      onChange={(event) => handleSlotChange('nivel1', clampInputValue(event.target.value, 999, 0))}
                    />
                  </label>
                  <button type="button" className="btn-secondary play-step-button" onClick={() => adjustSlot('nivel1', 1)}>{strings.increase}</button>
                </div>
              </div>

              <div className="play-control-group">
                <span className="play-control-label">{strings.slots2Label}</span>
                <div className="play-control-row">
                  <button type="button" className="btn-secondary play-step-button" onClick={() => adjustSlot('nivel2', -1)}>{strings.decrease}</button>
                  <label>
                    {strings.slots2Label}
                    <input
                      type="number"
                      value={formValues.slots_magia.nivel2}
                      onChange={(event) => handleSlotChange('nivel2', clampInputValue(event.target.value, 999, 0))}
                    />
                  </label>
                  <button type="button" className="btn-secondary play-step-button" onClick={() => adjustSlot('nivel2', 1)}>{strings.increase}</button>
                </div>
              </div>

              <div className="play-control-group">
                <span className="play-control-label">{strings.slots3Label}</span>
                <div className="play-control-row">
                  <button type="button" className="btn-secondary play-step-button" onClick={() => adjustSlot('nivel3', -1)}>{strings.decrease}</button>
                  <label>
                    {strings.slots3Label}
                    <input
                      type="number"
                      value={formValues.slots_magia.nivel3}
                      onChange={(event) => handleSlotChange('nivel3', clampInputValue(event.target.value, 999, 0))}
                    />
                  </label>
                  <button type="button" className="btn-secondary play-step-button" onClick={() => adjustSlot('nivel3', 1)}>{strings.increase}</button>
                </div>
              </div>
            </div>

            <div className="play-actions">
              <button type="button" className="btn-secondary" onClick={handleBackClick}>{strings.backButton}</button>
              <button type="button" className="btn-primary" onClick={handleSave} disabled={!canSave}>{strings.saveButton}</button>
            </div>

            <div className="play-note">
              {strings.playNote}
            </div>

            <ConfirmModal
              isOpen={showUnsavedModal}
              title={strings.unsavedTitle}
              message={strings.unsavedMessage}
              cancelLabel={strings.stayButton}
              confirmLabel={strings.leaveButton}
              onCancel={() => setShowUnsavedModal(false)}
              onConfirm={confirmLeaveWithoutSaving}
            />

            <MessageModal
              isOpen={showSavedModal}
              title={strings.savedTitle}
              message={strings.savedMessage}
              buttonLabel={strings.closeButton}
              onClose={() => setShowSavedModal(false)}
            />
          </div>
        )}
      </section>
    </main>
  )
}
