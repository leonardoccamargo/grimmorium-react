import { useLanguage } from '../context/LanguageContext.jsx'
import { Pencil, Play, Trash2 } from 'lucide-react'
import Tooltip from './Tooltip.jsx'

export default function CharacterCard({ character, onSelect, onDelete, onEdit }) {
  const { language } = useLanguage()
  const safeCharacter = {
    id: '-',
    nome: '',
    classe: '',
    nivel: 0,
    hp: '0/0',
    ca: 0,
    raca: '',
    antecedente: '',
    ...character,
    slots_magia: {
      nivel1: 0,
      nivel2: 0,
      nivel3: 0,
      ...(character?.slots_magia ?? {}),
    },
  }

  const strings = {
    classLabel: language === 'pt-br' ? 'Classe' : 'Class',
    levelLabel: language === 'pt-br' ? 'Nível' : 'Level',
    hpLabel: 'HP',
    acLabel: language === 'pt-br' ? 'CA' : 'AC',
    playTitle: language === 'pt-br' ? 'Jogar com este personagem' : 'Play with this character',
    editTitle: language === 'pt-br' ? 'Editar ficha do personagem' : 'Edit character sheet',
    deleteTitle: language === 'pt-br' ? 'Remover personagem' : 'Remove character',
  }

  return (
    <article className="character-card">
      <div className="character-card-body">
        <div className="character-card-info">
          <div className="character-card-topo">
            <span className="character-name">{safeCharacter.nome}</span>
          </div>

          <p className="character-identity">
            {safeCharacter.raca || '-'}
            {safeCharacter.antecedente ? ` · ${safeCharacter.antecedente}` : ''}
          </p>

          <div className="character-vitals">
            <span><strong>{strings.hpLabel}</strong>{safeCharacter.hp}</span>
            <span><strong>{strings.acLabel}</strong>{safeCharacter.ca}</span>
          </div>
        </div>

        <div className="character-actions">
          <Tooltip text={strings.playTitle}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onSelect?.(safeCharacter.id)}
              aria-label={strings.playTitle}
              title={strings.playTitle}
            >
              <Play size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </Tooltip>
          <Tooltip text={strings.editTitle}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onEdit?.(safeCharacter.id)}
              aria-label={strings.editTitle}
              title={strings.editTitle}
            >
              <Pencil size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </Tooltip>
          <Tooltip text={strings.deleteTitle}>
            <button
              type="button"
              className="btn-danger"
              onClick={() => onDelete?.(safeCharacter.id)}
              aria-label={strings.deleteTitle}
              title={strings.deleteTitle}
            >
              <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </Tooltip>
        </div>

        <div className="character-card-bottomline">
          <p className="character-line"><strong>{strings.classLabel}</strong><span>{safeCharacter.classe}</span></p>
          <p className="character-line character-level"><strong>{strings.levelLabel}</strong><span>{safeCharacter.nivel}</span></p>
        </div>
      </div>
    </article>
  )
}
