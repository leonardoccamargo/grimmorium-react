import { useLanguage } from '../context/LanguageContext.jsx'

export default function SpellCard({ spell, isSelected, onSelect, details, averageDamage, emptySummary }) {
  const { language } = useLanguage()
  const strings = {
    levelLabel: language === 'pt-br' ? 'Nível' : 'Level',
    cantrip: language === 'pt-br' ? 'Truque' : 'Cantrip',
    slotPrefix: language === 'pt-br' ? 'Slot' : 'Slot',
    averageDamageLabel: language === 'pt-br' ? 'Dano médio' : 'Average damage',
  }

  return (
    <article className={`spell-card ${isSelected ? 'spell-card-selected' : ''}`}>
      <button
        type="button"
        className="spell-card-button"
        onClick={onSelect}
        aria-pressed={isSelected}
      >
        <div className="spell-card-topo">
          <div>
            <h3>{spell.name}</h3>
            <p className="spell-card-meta">
              {strings.levelLabel} {spell.level === 0 ? strings.cantrip : spell.level}
            </p>
          </div>
          <span className="badge">
            {spell.level === 0 ? strings.cantrip : `${strings.slotPrefix} ${spell.level}`}
          </span>
        </div>

        <div className="spell-card-tags">
          {details?.components && (
            <span className="spell-tag">{details.components.join(', ')}</span>
          )}
          {averageDamage && (
            <span className="spell-tag">{strings.averageDamageLabel} {averageDamage}</span>
          )}
        </div>

        <p className="spell-card-summary">
          {details?.school?.name || emptySummary}
        </p>
      </button>
    </article>
  )
}
