import { useLanguage } from '../context/LanguageContext.jsx'

export default function CharacterCard({ character, onSelect, onDelete, onEdit }) {
  const { language } = useLanguage()

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
        <span className="character-name">{character.nome}</span>
        <span className="character-id">#{character.id}</span>
      </div>

      <p className="character-line"><strong>{strings.classLabel}:</strong> {character.classe}</p>
      <p className="character-line"><strong>{strings.levelLabel}:</strong> {character.nivel}</p>
      <p className="character-line"><strong>{strings.hpLabel}:</strong> {character.hp}</p>
      <p className="character-line"><strong>{strings.acLabel}:</strong> {character.ca}</p>

      <div className="character-slots">
        <span>{strings.slots1}: {character.slots_magia.nivel1}</span>
        <span>{strings.slots2}: {character.slots_magia.nivel2}</span>
        <span>{strings.slots3}: {character.slots_magia.nivel3}</span>
      </div>

      <div className="character-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onSelect(character.id)}
          title={strings.playTitle}
        >
          {strings.playButton}
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => onEdit(character.id)}
          title={strings.editTitle}
        >
          {strings.editButton}
        </button>
        <button
          type="button"
          className="btn-danger"
          onClick={() => onDelete(character.id)}
          title={strings.deleteTitle}
        >
          {strings.deleteButton}
        </button>
      </div>
    </article>
  )
}
