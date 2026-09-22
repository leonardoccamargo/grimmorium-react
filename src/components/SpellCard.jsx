import { useLanguage } from '../context/LanguageContext.jsx'

export default function SpellCard({ spell, isSelected, onSelect }) {
  const { language } = useLanguage()
  const cantrip = language === 'pt-br' ? 'Truque' : 'Cantrip'
  const emptyValue = '-'

  return (
    <article className={`spell-row ${isSelected ? 'spell-row-selected' : ''}`}>
      <button
        type="button"
        className="spell-row-button"
        onClick={onSelect}
        aria-pressed={isSelected}
        aria-expanded={isSelected}
        aria-controls={`spell-detail-${spell.index}`}
      >
        <div className="spell-row-main">
          <h3>{spell.name}</h3>
        </div>

        <div className="spell-row-meta">
          <span>{spell.school?.name || emptyValue}</span>
          <span>{spell.casting_time || emptyValue}</span>
          <span>{spell.level === 0 ? cantrip : spell.level ?? emptyValue}</span>
          <span>{spell.range || emptyValue}</span>
        </div>
      </button>
    </article>
  )
}
