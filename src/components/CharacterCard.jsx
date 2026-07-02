import { useLanguage } from '../context/LanguageContext.jsx'
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
    slots1: language === 'pt-br' ? 'Slots 1º' : '1st level slots',
    slots2: language === 'pt-br' ? 'Slots 2º' : '2nd level slots',
    slots3: language === 'pt-br' ? 'Slots 3º' : '3rd level slots',
    playButton: language === 'pt-br' ? 'Jogar' : 'Play',
    editButton: language === 'pt-br' ? 'Editar' : 'Edit',
    deleteButton: language === 'pt-br' ? 'Deletar' : 'Delete',
    playTitle: language === 'pt-br' ? 'Jogar com este personagem' : 'Play with this character',
    editTitle: language === 'pt-br' ? 'Editar ficha do personagem' : 'Edit character sheet',
    deleteTitle: language === 'pt-br' ? 'Remover personagem' : 'Remove character',
  }

  return (
    <article className="character-card">
      <div className="character-card-topo">
        <span className="character-name">{safeCharacter.nome}</span>
        <span className="character-id">#{safeCharacter.id}</span>
      </div>

      <p className="character-line"><strong>{strings.classLabel}:</strong> {safeCharacter.classe}</p>
      <p className="character-line"><strong>{strings.levelLabel}:</strong> {safeCharacter.nivel}</p>
      <p className="character-line"><strong>{strings.hpLabel}:</strong> {safeCharacter.hp}</p>
      <p className="character-line"><strong>{strings.acLabel}:</strong> {safeCharacter.ca}</p>

      <div className="character-slots">
        <span>{strings.slots1}: {safeCharacter.slots_magia.nivel1}</span>
        <span>{strings.slots2}: {safeCharacter.slots_magia.nivel2}</span>
        <span>{strings.slots3}: {safeCharacter.slots_magia.nivel3}</span>
      </div>

      <div className="character-actions">
        <Tooltip text={strings.playTitle}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onSelect?.(safeCharacter.id)}
            title={strings.playTitle}
          >
            {strings.playButton}
          </button>
        </Tooltip>
        <Tooltip text={strings.editTitle}>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onEdit?.(safeCharacter.id)}
            title={strings.editTitle}
          >
            {strings.editButton}
          </button>
        </Tooltip>
        <Tooltip text={strings.deleteTitle}>
          <button
            type="button"
            className="btn-danger"
            onClick={() => onDelete?.(safeCharacter.id)}
            title={strings.deleteTitle}
          >
            {strings.deleteButton}
          </button>
        </Tooltip>
      </div>
    </article>
  )
}
