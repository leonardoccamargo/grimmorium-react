import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { calculateCharacterMaxHp, SUPPORTED_DND5E_CLASSES } from '../utils/characterHealth.js'

const ATTRIBUTE_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const STANDARD_ARRAY_VALUES = [15, 14, 13, 12, 10, 8]
const POINT_BUY_COST = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
}

const RACE_OPTIONS = ['Humano', 'Elfo', 'Anão', 'Halfling', 'Draconato', 'Tiefling']
const SUBRACE_OPTIONS = {
  Humano: ['Padrão'],
  Elfo: ['Alto Elfo', 'Elfo da Floresta', 'Drow'],
  'Anão': ['Anão da Colina', 'Anão da Montanha'],
  Halfling: ['Pés-Leves', 'Robusto'],
  Draconato: ['Cromático', 'Metálico'],
  Tiefling: ['Infernal'],
}
const RACE_BONUSES = {
  Humano: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
  Elfo: { str: 0, dex: 2, con: 0, int: 0, wis: 0, cha: 0 },
  'Anão': { str: 0, dex: 0, con: 2, int: 0, wis: 0, cha: 0 },
  Halfling: { str: 0, dex: 2, con: 0, int: 0, wis: 0, cha: 0 },
  Draconato: { str: 2, dex: 0, con: 0, int: 0, wis: 0, cha: 1 },
  Tiefling: { str: 0, dex: 0, con: 0, int: 1, wis: 0, cha: 2 },
}
const ALIGNMENT_OPTIONS = [
  'Leal e Bom',
  'Neutro e Bom',
  'Caótico e Bom',
  'Leal e Neutro',
  'Neutro',
  'Caótico e Neutro',
  'Leal e Mau',
  'Neutro e Mau',
  'Caótico e Mau',
]
const BACKGROUND_OPTIONS = ['Acolito', 'Criminoso', 'Ermitão', 'Herói do Povo', 'Nobre', 'Sábio', 'Soldado']

const initialValues = {
  nome: '',
  campanha: '',
  raca: 'Humano',
  subraca: 'Padrão',
  classe: '',
  nivel: 1,
  alinhamento: 'Neutro',
  antecedente: 'Aventureiro',
  tracos: '',
  ideais: '',
  vinculos: '',
  defeitos: '',
  constituicao: 10,
  hp: '10/10',
  ca: 10,
  metodo_atributos: 'standard',
  atributos_base: {
    str: null,
    dex: null,
    con: null,
    int: null,
    wis: null,
    cha: null,
  },
  atributos_livres: {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  },
  atributos_point_buy: {
    str: 8,
    dex: 8,
    con: 8,
    int: 8,
    wis: 8,
    cha: 8,
  },
  slots_magia: {
    nivel1: 0,
    nivel2: 0,
    nivel3: 0,
  },
  consumiveis: '',
}

function normalizeConsumables(value) {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'string') return value
  return ''
}

function normalizeInitialValues(initial) {
  const source = initial ?? initialValues

  return {
    ...initialValues,
    ...source,
    slots_magia: {
      ...initialValues.slots_magia,
      ...(source.slots_magia ?? {}),
    },
    atributos_base: {
      ...initialValues.atributos_base,
      ...(source.atributos_base ?? {}),
    },
    atributos_livres: {
      ...initialValues.atributos_livres,
      ...(source.atributos_livres ?? {}),
    },
    atributos_point_buy: {
      ...initialValues.atributos_point_buy,
      ...(source.atributos_point_buy ?? {}),
    },
    consumiveis: normalizeConsumables(source.consumiveis),
  }
}

function roll4d6DropLowest() {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
  const total = rolls.reduce((sum, value) => sum + value, 0)
  return total - Math.min(...rolls)
}

function pointBuySpent(pointsState) {
  return ATTRIBUTE_KEYS.reduce((sum, key) => sum + (POINT_BUY_COST[pointsState[key]] ?? 0), 0)
}

export default function CharacterForm({ initial = initialValues, onSubmit, onCancel, submitLabel }) {
  const { language } = useLanguage()
  const [form, setForm] = useState(() => normalizeInitialValues(initial))
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    setForm(normalizeInitialValues(initial))
    setCurrentStep(0)
  }, [initial])

  const strings = {
    name: language === 'pt-br' ? 'Nome' : 'Name',
    class: language === 'pt-br' ? 'Classe' : 'Class',
    level: language === 'pt-br' ? 'Nível' : 'Level',
    constitution: language === 'pt-br' ? 'Constituição' : 'Constitution',
    hp: 'HP',
    ac: language === 'pt-br' ? 'CA' : 'AC',
    slots1: language === 'pt-br' ? 'Slots 1º nível' : '1st level slots',
    slots2: language === 'pt-br' ? 'Slots 2º nível' : '2nd level slots',
    slots3: language === 'pt-br' ? 'Slots 3º nível' : '3rd level slots',
    consumables: language === 'pt-br' ? 'Consumíveis (separados por vírgula)' : 'Consumables (comma separated)',
    cancel: language === 'pt-br' ? 'Cancelar' : 'Cancel',
    unsupportedClass:
      language === 'pt-br'
        ? 'Classes oficiais de D&D 5e disponíveis no seletor abaixo.'
        : 'Official D&D 5e classes available in the selector below.',
    selectClass: language === 'pt-br' ? 'Selecione uma classe' : 'Select a class',
    campaign: language === 'pt-br' ? 'Campanha (opcional)' : 'Campaign (optional)',
    race: language === 'pt-br' ? 'Raça' : 'Race',
    subrace: language === 'pt-br' ? 'Linhagem' : 'Subrace',
    alignment: language === 'pt-br' ? 'Alinhamento' : 'Alignment',
    background: language === 'pt-br' ? 'Antecedente' : 'Background',
    traits: language === 'pt-br' ? 'Traços de Personalidade' : 'Personality Traits',
    ideals: language === 'pt-br' ? 'Ideais' : 'Ideals',
    bonds: language === 'pt-br' ? 'Vínculos' : 'Bonds',
    flaws: language === 'pt-br' ? 'Defeitos' : 'Flaws',
    method: language === 'pt-br' ? 'Método de atributos' : 'Ability generation method',
    methodStandard: language === 'pt-br' ? 'Standard Array' : 'Standard Array',
    methodPointBuy: language === 'pt-br' ? 'Point Buy (27)' : 'Point Buy (27)',
    methodFree: language === 'pt-br' ? 'Valores livres' : 'Free values',
    pointsLeft: language === 'pt-br' ? 'Pontos restantes' : 'Points left',
    roll: language === 'pt-br' ? 'Rolar 4d6' : 'Roll 4d6',
    rollAll: language === 'pt-br' ? 'Rolar todos (4d6)' : 'Roll all (4d6)',
    review: language === 'pt-br' ? 'Revisão final' : 'Final review',
    next: language === 'pt-br' ? 'Próxima etapa' : 'Next step',
    back: language === 'pt-br' ? 'Voltar etapa' : 'Back step',
    wizardHint: language === 'pt-br' ? 'Criação guiada em etapas para manter a ficha consistente.' : 'Step-by-step wizard to keep the sheet consistent.',
    stepMeta: language === 'pt-br' ? '1. Metadados' : '1. Metadata',
    stepRace: language === 'pt-br' ? '2. Raça e linhagem' : '2. Race and subrace',
    stepClass: language === 'pt-br' ? '3. Classe e perfil' : '3. Class and profile',
    stepAttr: language === 'pt-br' ? '4. Atributos' : '4. Abilities',
    stepResources: language === 'pt-br' ? '5. Recursos' : '5. Resources',
    stepReview: language === 'pt-br' ? '6. Revisão' : '6. Review',
    strength: language === 'pt-br' ? 'Força' : 'Strength',
    dexterity: language === 'pt-br' ? 'Destreza' : 'Dexterity',
    constitutionLabel: language === 'pt-br' ? 'Constituição' : 'Constitution',
    intelligence: language === 'pt-br' ? 'Inteligência' : 'Intelligence',
    wisdom: language === 'pt-br' ? 'Sabedoria' : 'Wisdom',
    charisma: language === 'pt-br' ? 'Carisma' : 'Charisma',
  }

  const stepTitles = [
    strings.stepMeta,
    strings.stepRace,
    strings.stepClass,
    strings.stepAttr,
    strings.stepResources,
    strings.stepReview,
  ]

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSlotChange = (slot, value) => {
    const numericValue = Number(value)

    setForm((prev) => ({
      ...prev,
      slots_magia: {
        ...prev.slots_magia,
        [slot]: Number.isFinite(numericValue) ? numericValue : 0,
      },
    }))
  }

  const handleAttributeChange = (bucket, key, value) => {
    setForm((prev) => ({
      ...prev,
      [bucket]: {
        ...prev[bucket],
        [key]: value,
      },
    }))
  }

  const abilityLabels = {
    str: strings.strength,
    dex: strings.dexterity,
    con: strings.constitutionLabel,
    int: strings.intelligence,
    wis: strings.wisdom,
    cha: strings.charisma,
  }

  const racialBonuses = useMemo(() => RACE_BONUSES[form.raca] || RACE_BONUSES.Humano, [form.raca])

  const selectedBaseAbilities = useMemo(() => {
    if (form.metodo_atributos === 'pointbuy') return form.atributos_point_buy
    if (form.metodo_atributos === 'free') return form.atributos_livres
    return form.atributos_base
  }, [form.metodo_atributos, form.atributos_base, form.atributos_livres, form.atributos_point_buy])

  const totalAbilities = useMemo(() => {
    const totals = {}
    ATTRIBUTE_KEYS.forEach((key) => {
      const base = Number(selectedBaseAbilities[key] ?? 0)
      totals[key] = base + Number(racialBonuses[key] || 0)
    })
    return totals
  }, [selectedBaseAbilities, racialBonuses])

  const pointsSpent = useMemo(() => pointBuySpent(form.atributos_point_buy), [form.atributos_point_buy])
  const pointsLeft = 27 - pointsSpent

  const hpPreview = useMemo(() => {
    try {
      const maxHp = calculateCharacterMaxHp(
        form.classe,
        Number(form.nivel),
        Number(totalAbilities.con || 10),
        true,
        0,
      )
      return `${maxHp}/${maxHp}`
    } catch {
      return form.hp
    }
  }, [form.classe, form.nivel, totalAbilities.con, form.hp])

  const standardCounts = useMemo(() => {
    const counts = {}
    ATTRIBUTE_KEYS.forEach((key) => {
      const value = form.atributos_base[key]
      if (value == null) return
      counts[value] = (counts[value] || 0) + 1
    })
    return counts
  }, [form.atributos_base])

  const canAdvance = true

  const subraceOptions = SUBRACE_OPTIONS[form.raca] || ['Padrão']

  const rollAllFreeAbilities = () => {
    const rolledAbilities = {}
    ATTRIBUTE_KEYS.forEach((key) => {
      rolledAbilities[key] = roll4d6DropLowest()
    })

    setForm((prev) => ({
      ...prev,
      atributos_livres: {
        ...prev.atributos_livres,
        ...rolledAbilities,
      },
    }))
  }

  const adjustPointBuy = (attributeKey, delta) => {
    const currentValue = Number(form.atributos_point_buy[attributeKey] || 8)
    const candidate = Math.max(8, Math.min(15, currentValue + delta))
    if (candidate === currentValue) return

    const nextState = {
      ...form.atributos_point_buy,
      [attributeKey]: candidate,
    }

    if (pointBuySpent(nextState) > 27) return
    handleAttributeChange('atributos_point_buy', attributeKey, candidate)
  }

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <div className="form-grid form-grid-3">
          <label className="required-label">
            {strings.name} *
            <input
              type="text"
              value={form.nome}
              onChange={(event) => handleChange('nome', event.target.value)}
              required
            />
          </label>

          <label>
            {strings.campaign}
            <input
              type="text"
              value={form.campanha}
              onChange={(event) => handleChange('campanha', event.target.value)}
            />
          </label>

          <label className="required-label">
            {strings.level} *
            <input
              type="number"
              min="1"
              max="20"
              value={form.nivel}
              onChange={(event) => handleChange('nivel', event.target.value)}
              required
            />
          </label>
        </div>
      )
    }

    if (currentStep === 1) {
      return (
        <div className="form-grid form-grid-2">
          <label>
            {strings.race}
            <select value={form.raca} onChange={(event) => handleChange('raca', event.target.value)}>
              {RACE_OPTIONS.map((race) => <option key={race} value={race}>{race}</option>)}
            </select>
          </label>

          <label>
            {strings.subrace}
            <select value={form.subraca} onChange={(event) => handleChange('subraca', event.target.value)}>
              {subraceOptions.map((subrace) => <option key={subrace} value={subrace}>{subrace}</option>)}
            </select>
          </label>
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <>
          <div className="form-grid form-grid-3">
            <label className="required-label">
              {strings.class} *
              <select
                value={form.classe}
                onChange={(event) => handleChange('classe', event.target.value)}
                required
              >
                <option value="">{strings.selectClass}</option>
                {SUPPORTED_DND5E_CLASSES.map((className) => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
            </label>

            <label>
              {strings.alignment}
              <select value={form.alinhamento} onChange={(event) => handleChange('alinhamento', event.target.value)}>
                {ALIGNMENT_OPTIONS.map((alignment) => <option key={alignment} value={alignment}>{alignment}</option>)}
              </select>
            </label>

            <label>
              {strings.background}
              <select value={form.antecedente} onChange={(event) => handleChange('antecedente', event.target.value)}>
                <option value="Aventureiro">Aventureiro</option>
                {BACKGROUND_OPTIONS.map((background) => <option key={background} value={background}>{background}</option>)}
              </select>
            </label>
          </div>

          <div className="form-grid form-grid-4">
            <label>
              {strings.traits}
              <input type="text" value={form.tracos} onChange={(event) => handleChange('tracos', event.target.value)} />
            </label>
            <label>
              {strings.ideals}
              <input type="text" value={form.ideais} onChange={(event) => handleChange('ideais', event.target.value)} />
            </label>
            <label>
              {strings.bonds}
              <input type="text" value={form.vinculos} onChange={(event) => handleChange('vinculos', event.target.value)} />
            </label>
            <label>
              {strings.flaws}
              <input type="text" value={form.defeitos} onChange={(event) => handleChange('defeitos', event.target.value)} />
            </label>
          </div>
          <p className="form-hint">{strings.unsupportedClass}</p>
        </>
      )
    }

    if (currentStep === 3) {
      return (
        <>
          <div className="wizard-method-row">
            <label>
              {strings.method}
              <select value={form.metodo_atributos} onChange={(event) => handleChange('metodo_atributos', event.target.value)}>
                <option value="standard">{strings.methodStandard}</option>
                <option value="pointbuy">{strings.methodPointBuy}</option>
                <option value="free">{strings.methodFree}</option>
              </select>
            </label>

            {form.metodo_atributos === 'free' && (
              <button type="button" className="btn-secondary wizard-roll-all-button" onClick={rollAllFreeAbilities}>
                {strings.rollAll}
              </button>
            )}

            {form.metodo_atributos === 'pointbuy' && (
              <span className="wizard-points">{strings.pointsLeft}: {pointsLeft}</span>
            )}
          </div>

          <div className="ability-grid">
            {ATTRIBUTE_KEYS.map((key) => {
              const baseValue = Number(selectedBaseAbilities[key] ?? 0)
              const racialBonus = Number(racialBonuses[key] || 0)
              const total = Number(totalAbilities[key] || 0)

              return (
                <article key={key} className="ability-card">
                  <h4>{abilityLabels[key]}</h4>

                  {form.metodo_atributos === 'standard' && (
                    <select
                      value={form.atributos_base[key] ?? ''}
                      onChange={(event) => {
                        const raw = event.target.value
                        handleAttributeChange('atributos_base', key, raw === '' ? null : Number(raw))
                      }}
                    >
                      <option value="">-</option>
                      {STANDARD_ARRAY_VALUES.map((value) => {
                        const selectedCount = standardCounts[value] || 0
                        const currentValue = form.atributos_base[key]
                        const disabled = selectedCount >= 1 && currentValue !== value
                        return <option key={value} value={value} disabled={disabled}>{value}</option>
                      })}
                    </select>
                  )}

                  {form.metodo_atributos === 'pointbuy' && (
                    <div className="ability-stepper">
                      <button type="button" className="btn-secondary" onClick={() => adjustPointBuy(key, -1)}>-</button>
                      <span>{form.atributos_point_buy[key]}</span>
                      <button type="button" className="btn-secondary" onClick={() => adjustPointBuy(key, 1)}>+</button>
                    </div>
                  )}

                  {form.metodo_atributos === 'free' && (
                    <div className="ability-free-row">
                      <input
                        type="number"
                        min="3"
                        max="18"
                        value={form.atributos_livres[key]}
                        onChange={(event) => handleAttributeChange('atributos_livres', key, Number(event.target.value || 0))}
                      />
                    </div>
                  )}

                  <p>Base: {baseValue}</p>
                  <p>Racial: +{racialBonus}</p>
                  <p>Total: {total}</p>
                </article>
              )
            })}
          </div>
        </>
      )
    }

    if (currentStep === 4) {
      return (
        <>
          <div className="form-grid form-grid-mixed">
            <label className="required-label">
              {strings.ac} *
              <input
                type="number"
                min="0"
                value={form.ca}
                onChange={(event) => handleChange('ca', event.target.value)}
                required
              />
            </label>

            <label>
              {strings.hp}
              <input type="text" value={hpPreview} readOnly />
            </label>

            <label>
              {strings.slots1}
              <input type="number" min="0" value={form.slots_magia.nivel1} onChange={(event) => handleSlotChange('nivel1', event.target.value)} />
            </label>

            <label>
              {strings.slots2}
              <input type="number" min="0" value={form.slots_magia.nivel2} onChange={(event) => handleSlotChange('nivel2', event.target.value)} />
            </label>

            <label>
              {strings.slots3}
              <input type="number" min="0" value={form.slots_magia.nivel3} onChange={(event) => handleSlotChange('nivel3', event.target.value)} />
            </label>
          </div>

          <label className="full-width">
            {strings.consumables}
            <input
              type="text"
              value={form.consumiveis}
              onChange={(event) => handleChange('consumiveis', event.target.value)}
            />
          </label>
        </>
      )
    }

    return (
      <div className="wizard-review">
        <h4>{strings.review}</h4>
        <p><strong>{strings.name}:</strong> {form.nome}</p>
        <p><strong>{strings.campaign}:</strong> {form.campanha || '-'}</p>
        <p><strong>{strings.class}:</strong> {form.classe}</p>
        <p><strong>{strings.level}:</strong> {form.nivel}</p>
        <p><strong>{strings.race}:</strong> {form.raca} ({form.subraca})</p>
        <p><strong>{strings.alignment}:</strong> {form.alinhamento}</p>
        <p><strong>{strings.background}:</strong> {form.antecedente}</p>
        <p><strong>{strings.hp}:</strong> {hpPreview}</p>
        <p><strong>{strings.ac}:</strong> {form.ca}</p>
      </div>
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.nome.trim()) {
      setCurrentStep(0)
      return
    }
    if (!form.classe) {
      setCurrentStep(2)
      return
    }

    const calculatedHp = (() => {
      try {
        const maxHp = calculateCharacterMaxHp(
          form.classe,
          Number(form.nivel),
          Number(form.constituicao),
          true,
          0,
        )

        return `${maxHp}/${maxHp}`
      } catch {
        return form.hp
      }
    })()

    onSubmit({
      ...form,
      nivel: Number(form.nivel),
      constituicao: Number(totalAbilities.con || 10),
      ca: Number(form.ca),
      hp: calculatedHp,
      raca: form.raca,
      subraca: form.subraca,
      campanha: form.campanha,
      alinhamento: form.alinhamento,
      antecedente: form.antecedente,
      tracos: form.tracos,
      ideais: form.ideais,
      vinculos: form.vinculos,
      defeitos: form.defeitos,
      atributos_base: {
        str: Number(selectedBaseAbilities.str || 10),
        dex: Number(selectedBaseAbilities.dex || 10),
        con: Number(selectedBaseAbilities.con || 10),
        int: Number(selectedBaseAbilities.int || 10),
        wis: Number(selectedBaseAbilities.wis || 10),
        cha: Number(selectedBaseAbilities.cha || 10),
      },
      atributos_raciais: racialBonuses,
      consumiveis: String(form.consumiveis ?? '').split(',').map((item) => item.trim()).filter(Boolean),
    })
  }

  return (
    <form className="character-form" onSubmit={handleSubmit}>
      <div className="wizard-progress">
        {stepTitles.map((title, index) => (
          <button
            key={title}
            type="button"
            className={`wizard-step ${index === currentStep ? 'is-active' : ''} ${index < currentStep ? 'is-done' : ''}`}
            onClick={() => {
              setCurrentStep(index)
            }}
          >
            <span>{index + 1}</span>
            <small>{title}</small>
          </button>
        ))}
      </div>

      <p className="form-hint">{strings.wizardHint}</p>

      {renderStep()}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>{strings.cancel}</button>
        {currentStep > 0 && (
          <button type="button" className="btn-secondary" onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}>
            {strings.back}
          </button>
        )}
        {currentStep < stepTitles.length - 1 && (
          <button type="button" className="btn-primary" disabled={!canAdvance} onClick={() => setCurrentStep((prev) => Math.min(prev + 1, stepTitles.length - 1))}>
            {strings.next}
          </button>
        )}
        {currentStep === stepTitles.length - 1 && (
          <button type="submit" className="btn-primary">{submitLabel}</button>
        )}
      </div>
    </form>
  )
}
