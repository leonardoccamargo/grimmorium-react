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
    spellSlotsLabel: language === 'pt-br' ? 'Slots de Feitiço (usados)' : 'Spell Slots (used)',
    noSpellSlots: language === 'pt-br' ? 'Sem slots para esta classe/nível.' : 'No slots for this class/level.',
    backButton: language === 'pt-br' ? 'Voltar' : 'Back',
    saveButton: language === 'pt-br' ? 'Salvar' : 'Save',
    saveAndLeaveButton: language === 'pt-br' ? 'Salvar e sair' : 'Save and leave',
    shortRestButton: language === 'pt-br' ? 'Descanso curto' : 'Short rest',
    longRestButton: language === 'pt-br' ? 'Descanso longo' : 'Long rest',
    playNote: language === 'pt-br'
      ? 'Clique nas caixas para marcar os slots gastos em tempo real.'
      : 'Click the boxes to track spent slots in real time.',
    hpCurrentLabel: language === 'pt-br' ? 'HP atual' : 'Current HP',
    hpMaxLabel: language === 'pt-br' ? 'HP máximo' : 'Max HP',
    hpTempLabel: language === 'pt-br' ? 'HP temporário' : 'Temp HP',
    increase: '+',
    decrease: '-',
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
      slots_usados: {
        ...selecionado.slots_usados,
        ...editedValues.slots_usados,
      },
    }
  }, [selecionado, editedValues])

  const handleChange = (field, value) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleUsedSlotChange = (slot, value) => {
    setEditedValues((prev) => ({
      ...prev,
      slots_usados: {
        ...prev.slots_usados,
        [slot]: Number(value),
      },
    }))
  }

  const handleVoltar = () => navigate('/personagens')
  const persistChanges = async ({ exitAfterSave = false, showSavedModal = true } = {}) => {
    if (formValues) {
      const parsedHp = parseHpString(formValues.hp)
      const hpMaxFromField = Number(formValues.hp_max)
      const resolvedMax = Number.isFinite(hpMaxFromField) && hpMaxFromField > 0 ? hpMaxFromField : Math.max(1, parsedHp.max)
      const hpCurrentFromField = Number(formValues.hp_current)
      const resolvedCurrent = Number.isFinite(hpCurrentFromField)
        ? clampHpToMax(Math.max(0, hpCurrentFromField), resolvedMax)
        : clampHpToMax(parsedHp.current, resolvedMax)
      const hpTempFromField = Number(formValues.hp_temp)
      const resolvedTemp = Number.isFinite(hpTempFromField) ? Math.max(0, hpTempFromField) : 0

      const saved = await updateCharacter({
        ...formValues,
        hp_current: resolvedCurrent,
        hp_max: resolvedMax,
        hp_temp: resolvedTemp,
        hp: formatHpString(resolvedCurrent, resolvedMax),
      })
      if (!saved) return
    }

    setEditedValues({})

    if (exitAfterSave) {
      setShowUnsavedModal(false)
      handleVoltar()
      return
    }

    if (showSavedModal) {
      setShowSavedModal(true)
    }
  }

  const handleSave = async () => {
    await persistChanges()
  }

  const handleSaveAndLeave = async () => {
    await persistChanges({ exitAfterSave: true, showSavedModal: false })
  }

  const hpState = useMemo(() => {
    if (!formValues) {
      return { current: 0, max: 0, temp: 0 }
    }

    const parsedHp = parseHpString(formValues.hp)
    const maxFromField = Number(formValues.hp_max)
    const max = Number.isFinite(maxFromField) && maxFromField > 0 ? maxFromField : Math.max(1, parsedHp.max)
    const currentFromField = Number(formValues.hp_current)
    const current = Number.isFinite(currentFromField)
      ? clampHpToMax(Math.max(0, currentFromField), max)
      : clampHpToMax(parsedHp.current, max)
    const tempFromField = Number(formValues.hp_temp)
    const temp = Number.isFinite(tempFromField) ? Math.max(0, tempFromField) : 0

    return { current, max, temp }
  }, [formValues])

  const adjustHpCurrent = (delta) => {
    if (!formValues) return
    handleChange('hp_current', clampHpToMax(hpState.current + delta, hpState.max))
  }

  const adjustHpTemp = (delta) => {
    if (!formValues) return
    handleChange('hp_temp', Math.max(0, hpState.temp + delta))
  }

  const handleHpCurrentInput = (value) => {
    handleChange('hp_current', clampHpToMax(Number(value) || 0, hpState.max))
  }

  const handleHpTempInput = (value) => {
    handleChange('hp_temp', Math.max(0, Number(value) || 0))
  }

  const adjustNumberField = (field, delta, minimum = 0) => {
    if (!formValues) return
    const currentValue = Number(formValues[field]) || 0
    handleChange(field, Math.max(minimum, currentValue + delta))
  }

  const slotLevels = useMemo(() => {
    if (!formValues?.slots_magia) return []

    return Array.from({ length: 9 }, (_, index) => {
      const level = index + 1
      const key = `nivel${level}`
      const max = Number(formValues.slots_magia[key]) || 0
      const used = Number(formValues.slots_usados?.[key]) || 0

      return {
        level,
        key,
        max,
        used: Math.min(Math.max(used, 0), max),
      }
    }).filter((entry) => entry.max > 0)
  }, [formValues])

  const handleSlotBoxClick = (slotKey, slotIndex, currentUsed) => {
    const clickedValue = slotIndex + 1
    const nextValue = currentUsed === clickedValue ? clickedValue - 1 : clickedValue
    handleUsedSlotChange(slotKey, Math.max(0, nextValue))
  }

  const normalizeClass = (value) => String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

  const resetUsedSlots = (mode = 'all') => {
    if (!formValues?.slots_magia) return

    const normalizedClass = normalizeClass(formValues.classe)
    const shouldResetWarlockOnly = mode === 'short' && normalizedClass === 'bruxo'
    const nextUsed = {}

    Array.from({ length: 9 }, (_, index) => index + 1).forEach((level) => {
      const key = `nivel${level}`
      const maxForLevel = Number(formValues.slots_magia?.[key]) || 0
      const currentUsed = Number(formValues.slots_usados?.[key]) || 0

      if (mode === 'long') {
        nextUsed[key] = 0
        return
      }

      if (shouldResetWarlockOnly && maxForLevel > 0) {
        nextUsed[key] = 0
        return
      }

      nextUsed[key] = currentUsed
    })

    setEditedValues((prev) => ({
      ...prev,
      slots_usados: {
        ...prev.slots_usados,
        ...nextUsed,
      },
    }))
  }

  const handleShortRest = () => {
    resetUsedSlots('short')
  }

  const handleLongRest = () => {
    if (!formValues) return

    handleChange('hp_current', hpState.max)
    handleChange('hp_temp', 0)
    resetUsedSlots('long')
  }

  const canSave = useMemo(() => {
    return formValues
      && Number.isFinite(Number(hpState.current))
      && Number.isFinite(Number(hpState.max))
      && Number.isFinite(Number(hpState.temp))
      && formValues.ca != null
      && formValues.slots_magia
  }, [formValues, hpState.current, hpState.max, hpState.temp])

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
              <div className="play-control-group play-hp-group">
                <span className="play-control-label">{strings.hpLabel}</span>
                <div className="play-hp-grid">
                  <div className="play-hp-cell">
                    <span>{strings.hpCurrentLabel}</span>
                    <div className="play-control-row play-control-row-compact">
                      <button type="button" className="btn-secondary play-step-button" onClick={() => adjustHpCurrent(-1)}>{strings.decrease}</button>
                      <input
                        type="number"
                        min="0"
                        max={hpState.max}
                        value={hpState.current}
                        onChange={(event) => handleHpCurrentInput(event.target.value)}
                      />
                      <button type="button" className="btn-secondary play-step-button" onClick={() => adjustHpCurrent(1)}>{strings.increase}</button>
                    </div>
                  </div>

                  <div className="play-hp-cell">
                    <span>{strings.hpMaxLabel}</span>
                    <input type="number" value={hpState.max} readOnly />
                  </div>

                  <div className="play-hp-cell">
                    <span>{strings.hpTempLabel}</span>
                    <div className="play-control-row play-control-row-compact">
                      <button type="button" className="btn-secondary play-step-button" onClick={() => adjustHpTemp(-1)}>{strings.decrease}</button>
                      <input
                        type="number"
                        min="0"
                        value={hpState.temp}
                        onChange={(event) => handleHpTempInput(event.target.value)}
                      />
                      <button type="button" className="btn-secondary play-step-button" onClick={() => adjustHpTemp(1)}>{strings.increase}</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="play-control-group">
                <span className="play-control-label">{strings.acLabel}</span>
                <div className="play-control-row play-control-row-compact">
                  <button type="button" className="btn-secondary play-step-button" onClick={() => adjustNumberField('ca', -1)}>{strings.decrease}</button>
                  <label className="play-inline-field">
                    <span>{strings.acLabel}</span>
                    <input
                      type="number"
                      value={formValues.ca}
                      onChange={(event) => handleChange('ca', clampInputValue(event.target.value, 99, 0))}
                    />
                  </label>
                  <button type="button" className="btn-secondary play-step-button" onClick={() => adjustNumberField('ca', 1)}>{strings.increase}</button>
                </div>
              </div>

              <div className="play-control-group play-slots-group">
                <span className="play-control-label">{strings.spellSlotsLabel}</span>
                {slotLevels.length === 0 ? (
                  <p className="play-slot-empty">{strings.noSpellSlots}</p>
                ) : (
                  <div className="play-slots-grid">
                    {slotLevels.map((slotInfo) => (
                      <div key={slotInfo.key} className="play-slot-row">
                        <span className="play-slot-level">{slotInfo.level}º</span>
                        <div className="play-slot-boxes">
                          {Array.from({ length: slotInfo.max }, (_, slotIndex) => {
                            const isUsed = slotIndex < slotInfo.used
                            return (
                              <button
                                key={`${slotInfo.key}-${slotIndex + 1}`}
                                type="button"
                                className={`play-slot-box ${isUsed ? 'is-used' : ''}`}
                                onClick={() => handleSlotBoxClick(slotInfo.key, slotIndex, slotInfo.used)}
                                title={`${slotInfo.level}º ${slotIndex + 1}`}
                              >
                                {slotIndex + 1}
                              </button>
                            )
                          })}
                        </div>
                        <span className="play-slot-count">{slotInfo.used}/{slotInfo.max}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="play-actions">
              <button type="button" className="btn-secondary" onClick={handleShortRest}>{strings.shortRestButton}</button>
              <button type="button" className="btn-secondary" onClick={handleLongRest}>{strings.longRestButton}</button>
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
              extraActionLabel={strings.saveAndLeaveButton}
              onExtraAction={handleSaveAndLeave}
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
