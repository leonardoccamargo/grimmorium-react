import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { calculateCharacterMaxHp, SUPPORTED_DND5E_CLASSES } from '../utils/characterHealth.js'

const initialValues = {
  nome: '',
  classe: '',
  nivel: 1,
  constituicao: 10,
  hp: '10/10',
  ca: 10,
  slots_magia: {
    nivel1: 0,
    nivel2: 0,
    nivel3: 0,
  },
  consumiveis: '',
}

export default function CharacterForm({ initial = initialValues, onSubmit, onCancel, submitLabel }) {
  const { language } = useLanguage()
  const [form, setForm] = useState(initial)

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
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSlotChange = (slot, value) => {
    setForm((prev) => ({
      ...prev,
      slots_magia: {
        ...prev.slots_magia,
        [slot]: Number(value),
      },
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
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
      constituicao: Number(form.constituicao),
      ca: Number(form.ca),
      hp: calculatedHp,
      consumiveis: form.consumiveis.split(',').map((item) => item.trim()).filter(Boolean),
    })
  }

  return (
    <form className="character-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          {strings.name}
          <input
            type="text"
            value={form.nome}
            onChange={(event) => handleChange('nome', event.target.value)}
            required
          />
        </label>

        <label>
          {strings.class}
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
          {strings.level}
          <input
            type="number"
            min="1"
            value={form.nivel}
            onChange={(event) => handleChange('nivel', event.target.value)}
            required
          />
        </label>

        <label>
          {strings.constitution}
          <input
            type="number"
            min="1"
            value={form.constituicao}
            onChange={(event) => handleChange('constituicao', event.target.value)}
            required
          />
        </label>

        <label>
          {strings.hp}
          <input
            type="text"
            value={form.hp}
            onChange={(event) => handleChange('hp', event.target.value)}
            required
          />
        </label>

        <label>
          {strings.ac}
          <input
            type="number"
            min="0"
            value={form.ca}
            onChange={(event) => handleChange('ca', event.target.value)}
            required
          />
        </label>

        <label>
          {strings.slots1}
          <input
            type="number"
            min="0"
            value={form.slots_magia.nivel1}
            onChange={(event) => handleSlotChange('nivel1', event.target.value)}
          />
        </label>

        <label>
          {strings.slots2}
          <input
            type="number"
            min="0"
            value={form.slots_magia.nivel2}
            onChange={(event) => handleSlotChange('nivel2', event.target.value)}
          />
        </label>

        <label>
          {strings.slots3}
          <input
            type="number"
            min="0"
            value={form.slots_magia.nivel3}
            onChange={(event) => handleSlotChange('nivel3', event.target.value)}
          />
        </label>
      </div>

      <p className="form-hint">{strings.unsupportedClass}</p>

      <label className="full-width">
        {strings.consumables}
        <input
          type="text"
          value={form.consumiveis}
          onChange={(event) => handleChange('consumiveis', event.target.value)}
        />
      </label>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>{strings.cancel}</button>
        <button type="submit" className="btn-primary">{submitLabel}</button>
      </div>
    </form>
  )
}
