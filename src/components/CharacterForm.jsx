import { useMemo, useState } from 'react'
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
  raca: '',
  subraca: '',
  classe: '',
  nivel: '',
  alinhamento: '',
  antecedente: '',
  tracos: '',
  ideais: '',
  vinculos: '',
  defeitos: '',
  constituicao: 10,
  hp: '10/10',
  ca: 10,
  metodo_atributos: '',
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

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function getAutoSpellSlots(className, level) {
  const normalizedClass = normalizeText(className)
  const safeLevel = Math.max(1, Math.min(20, Number(level) || 1))

  const fullCasterSlots = [
    [2, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 2, 0, 0, 0, 0, 0, 0, 0],
    [4, 3, 0, 0, 0, 0, 0, 0, 0],
    [4, 3, 2, 0, 0, 0, 0, 0, 0],
    [4, 3, 3, 0, 0, 0, 0, 0, 0],
    [4, 3, 3, 1, 0, 0, 0, 0, 0],
    [4, 3, 3, 2, 0, 0, 0, 0, 0],
    [4, 3, 3, 3, 1, 0, 0, 0, 0],
    [4, 3, 3, 3, 2, 0, 0, 0, 0],
    [4, 3, 3, 3, 2, 1, 0, 0, 0],
    [4, 3, 3, 3, 2, 1, 0, 0, 0],
    [4, 3, 3, 3, 2, 1, 1, 0, 0],
    [4, 3, 3, 3, 2, 1, 1, 0, 0],
    [4, 3, 3, 3, 2, 1, 1, 1, 0],
    [4, 3, 3, 3, 2, 1, 1, 1, 0],
    [4, 3, 3, 3, 2, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 2, 1, 1],
  ]

  const warlockPactSlots = [
    { count: 1, level: 1 }, { count: 2, level: 1 }, { count: 2, level: 2 }, { count: 2, level: 2 },
    { count: 2, level: 3 }, { count: 2, level: 3 }, { count: 2, level: 4 }, { count: 2, level: 4 },
    { count: 2, level: 5 }, { count: 2, level: 5 }, { count: 3, level: 5 }, { count: 3, level: 5 },
    { count: 3, level: 5 }, { count: 3, level: 5 }, { count: 3, level: 5 }, { count: 3, level: 5 },
    { count: 4, level: 5 }, { count: 4, level: 5 }, { count: 4, level: 5 }, { count: 4, level: 5 },
  ]
  const fullCasters = ['bardo', 'clerigo', 'druida', 'mago', 'feiticeiro']
  const halfCasters = ['paladino', 'patrulheiro']

  const mapRowToSlots = (row) => ({
    nivel1: row[0] || 0,
    nivel2: row[1] || 0,
    nivel3: row[2] || 0,
    nivel4: row[3] || 0,
    nivel5: row[4] || 0,
    nivel6: row[5] || 0,
    nivel7: row[6] || 0,
    nivel8: row[7] || 0,
    nivel9: row[8] || 0,
  })

  if (fullCasters.includes(normalizedClass)) {
    return mapRowToSlots(fullCasterSlots[safeLevel - 1])
  }

  if (halfCasters.includes(normalizedClass)) {
    const casterLevel = Math.floor(safeLevel / 2)
    if (casterLevel <= 0) return mapRowToSlots(Array(9).fill(0))
    return mapRowToSlots(fullCasterSlots[casterLevel - 1])
  }

  if (normalizedClass === 'artifice' || normalizedClass === 'artificie') {
    const casterLevel = Math.ceil(safeLevel / 2)
    return mapRowToSlots(fullCasterSlots[Math.max(1, casterLevel) - 1])
  }

  if (normalizedClass === 'bruxo') {
    const pact = warlockPactSlots[safeLevel - 1]
    const slots = mapRowToSlots(Array(9).fill(0))
    slots[`nivel${pact.level}`] = pact.count
    return slots
  }

  return mapRowToSlots(Array(9).fill(0))
}

export default function CharacterForm({ initial = initialValues, onSubmit, onCancel, submitLabel }) {
  const { language } = useLanguage()
  const [form, setForm] = useState(() => normalizeInitialValues(initial))
  const [currentStep, setCurrentStep] = useState(0)
  const [submitAttempted, setSubmitAttempted] = useState(false)

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
    consumables: language === 'pt-br' ? 'Itens iniciais (opcional, separados por vírgula)' : 'Starting items (optional, comma separated)',
    cancel: language === 'pt-br' ? 'Cancelar' : 'Cancel',
    selectClass: language === 'pt-br' ? 'Selecione uma classe' : 'Select a class',
    selectRace: language === 'pt-br' ? 'Selecione uma raça' : 'Select a race',
    selectSubrace: language === 'pt-br' ? 'Selecione uma linhagem' : 'Select a subrace',
    selectAlignment: language === 'pt-br' ? 'Selecione um alinhamento' : 'Select an alignment',
    selectBackground: language === 'pt-br' ? 'Selecione um antecedente' : 'Select a background',
    selectMethod: language === 'pt-br' ? 'Selecione um método' : 'Select a method',
    selectLevel: language === 'pt-br' ? 'Selecione o nível' : 'Select a level',
    enterName: language === 'pt-br' ? 'Insira seu nome' : 'Enter your name',
    enterCampaign: language === 'pt-br' ? 'Insira o nome da sua campanha' : 'Enter your campaign name',
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
    spellSlotsSummary: language === 'pt-br' ? 'Slots de magia' : 'Spell slots',
    noSpellSlots: language === 'pt-br' ? 'Sem slots para essa classe/nível' : 'No slots for this class/level',
    next: language === 'pt-br' ? 'Próxima etapa' : 'Next step',
    back: language === 'pt-br' ? 'Voltar etapa' : 'Back step',
    stepMeta: language === 'pt-br' ? '1. Metadados' : '1. Metadata',
    stepRace: language === 'pt-br' ? '2. Raça e linhagem' : '2. Race and subrace',
    stepClass: language === 'pt-br' ? '3. Classe e perfil' : '3. Class and profile',
    stepAttr: language === 'pt-br' ? '4. Atributos' : '4. Abilities',
    stepResources: language === 'pt-br' ? '5. Equipamentos' : '5. Equipment',
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
    if (field === 'raca') {
      setForm((prev) => ({ ...prev, raca: value, subraca: '' }))
      return
    }
    setForm((prev) => ({ ...prev, [field]: value }))
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

  const autoResources = useMemo(() => {
    const dexTotal = Number(totalAbilities.dex || 10)
    const dexModifier = Math.floor((dexTotal - 10) / 2)
    const autoAc = Math.max(1, 10 + dexModifier)
    const autoSlots = getAutoSpellSlots(form.classe, form.nivel)

    return {
      hp: hpPreview,
      ac: autoAc,
      slots: autoSlots,
    }
  }, [form.classe, form.nivel, totalAbilities.dex, hpPreview])

  const reviewSpellSlots = useMemo(() => {
    return Object.entries(autoResources.slots)
      .map(([key, value]) => ({
        level: Number(key.replace('nivel', '')),
        count: Number(value || 0),
      }))
      .filter((entry) => entry.count > 0)
      .sort((a, b) => a.level - b.level)
  }, [autoResources.slots])

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
  const isNameInvalid = submitAttempted && !form.nome.trim()
  const isClassInvalid = submitAttempted && !form.classe
  const isLevelInvalid = submitAttempted && (!Number.isFinite(Number(form.nivel)) || Number(form.nivel) < 1)
  const isRaceInvalid = submitAttempted && !form.raca
  const isSubraceInvalid = submitAttempted && !form.subraca
  const isAlignmentInvalid = submitAttempted && !form.alinhamento
  const isBackgroundInvalid = submitAttempted && !form.antecedente
  const isMethodInvalid = submitAttempted && !form.metodo_atributos
  const isStandardAbilitiesInvalid = submitAttempted
    && form.metodo_atributos === 'standard'
    && ATTRIBUTE_KEYS.some((key) => form.atributos_base[key] == null)

  const subraceOptions = SUBRACE_OPTIONS[form.raca] || []

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
          <label className={`required-label ${isNameInvalid ? 'is-invalid' : ''}`}>
            {strings.name} *
            <input
              type="text"
              value={form.nome}
              onChange={(event) => handleChange('nome', event.target.value)}
              placeholder={strings.enterName}
              required
            />
          </label>

          <label>
            {strings.campaign}
            <input
              type="text"
              value={form.campanha}
              onChange={(event) => handleChange('campanha', event.target.value)}
              placeholder={strings.enterCampaign}
            />
          </label>

          <label className={`required-label ${isLevelInvalid ? 'is-invalid' : ''}`}>
            {strings.level} *
            <select
              className={!form.nivel ? 'is-placeholder' : ''}
              value={form.nivel}
              onChange={(event) => handleChange('nivel', event.target.value)}
              required
            >
              <option value="">{strings.selectLevel}</option>
              {Array.from({ length: 20 }, (_, idx) => {
                const level = String(idx + 1)
                return <option key={level} value={level}>{level}</option>
              })}
            </select>
          </label>
        </div>
      )
    }

    if (currentStep === 1) {
      return (
        <div className="form-grid form-grid-2">
          <label className={`required-label ${isRaceInvalid ? 'is-invalid' : ''}`}>
            {strings.race} *
            <select className={!form.raca ? 'is-placeholder' : ''} value={form.raca} onChange={(event) => handleChange('raca', event.target.value)} required>
              <option value="">{strings.selectRace}</option>
              {RACE_OPTIONS.map((race) => <option key={race} value={race}>{race}</option>)}
            </select>
          </label>

          <label className={`required-label ${isSubraceInvalid ? 'is-invalid' : ''}`}>
            {strings.subrace} *
            <select className={!form.subraca ? 'is-placeholder' : ''} value={form.subraca} onChange={(event) => handleChange('subraca', event.target.value)} required disabled={!form.raca}>
              <option value="">{strings.selectSubrace}</option>
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
            <label className={`required-label ${isClassInvalid ? 'is-invalid' : ''}`}>
              {strings.class} *
              <select
                className={!form.classe ? 'is-placeholder' : ''}
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

            <label className={`required-label ${isAlignmentInvalid ? 'is-invalid' : ''}`}>
              {strings.alignment} *
              <select className={!form.alinhamento ? 'is-placeholder' : ''} value={form.alinhamento} onChange={(event) => handleChange('alinhamento', event.target.value)} required>
                <option value="">{strings.selectAlignment}</option>
                {ALIGNMENT_OPTIONS.map((alignment) => <option key={alignment} value={alignment}>{alignment}</option>)}
              </select>
            </label>

            <label className={`required-label ${isBackgroundInvalid ? 'is-invalid' : ''}`}>
              {strings.background} *
              <select className={!form.antecedente ? 'is-placeholder' : ''} value={form.antecedente} onChange={(event) => handleChange('antecedente', event.target.value)} required>
                <option value="">{strings.selectBackground}</option>
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
        </>
      )
    }

    if (currentStep === 3) {
      return (
        <>
          <div className="wizard-method-row">
            <label className={`required-label ${isMethodInvalid || isStandardAbilitiesInvalid ? 'is-invalid' : ''}`}>
              {strings.method} *
              <select className={!form.metodo_atributos ? 'is-placeholder' : ''} value={form.metodo_atributos} onChange={(event) => handleChange('metodo_atributos', event.target.value)} required>
                <option value="">{strings.selectMethod}</option>
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
                  <h4 className={(submitAttempted && form.metodo_atributos === 'standard' && form.atributos_base[key] == null) ? 'required-label is-invalid' : ''}>
                    {abilityLabels[key]}
                  </h4>

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
        <p><strong>{strings.hp}:</strong> {autoResources.hp}</p>
        <p><strong>{strings.ac}:</strong> {autoResources.ac}</p>
        <p>
          <strong>{strings.spellSlotsSummary}:</strong>{' '}
          {reviewSpellSlots.length > 0
            ? reviewSpellSlots.map((entry) => `${entry.level}º: ${entry.count}`).join(' | ')
            : strings.noSpellSlots}
        </p>
      </div>
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitAttempted(true)

    if (!form.nome.trim()) {
      setCurrentStep(0)
      return
    }
    if (!Number.isFinite(Number(form.nivel)) || Number(form.nivel) < 1) {
      setCurrentStep(0)
      return
    }
    if (!form.raca || !form.subraca) {
      setCurrentStep(1)
      return
    }
    if (!form.classe) {
      setCurrentStep(2)
      return
    }
    if (!form.alinhamento || !form.antecedente) {
      setCurrentStep(2)
      return
    }
    if (!form.metodo_atributos) {
      setCurrentStep(3)
      return
    }
    if (form.metodo_atributos === 'standard' && ATTRIBUTE_KEYS.some((key) => form.atributos_base[key] == null)) {
      setCurrentStep(3)
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
      ca: autoResources.ac,
      hp: autoResources.hp || calculatedHp,
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
      slots_magia: autoResources.slots,
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
