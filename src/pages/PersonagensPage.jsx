import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCharacters } from '../context/CharactersContext'
import { useLanguage } from '../context/LanguageContext.jsx'
import SearchBar from '../components/SearchBar'
import CharacterCard from '../components/CharacterCard'
import LoadingIndicator from '../components/LoadingIndicator'
import CharacterForm from '../components/CharacterForm'
import ConfirmModal from '../components/ConfirmModal'

export default function PersonagensPage() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { personagens, status, mensagem, deleteCharacter, addCharacter, clearMensagem } = useCharacters()
  const [busca, setBusca] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  const strings = {
    title: language === 'pt-br' ? 'Personagens' : 'Characters',
    subtitle: language === 'pt-br' ? 'Veja, filtre e selecione seu personagem para jogar.' : 'View, filter, and select your character to play.',
    buttonNew: language === 'pt-br' ? 'Novo Personagem' : 'New Character',
    confirmDeleteTitle: language === 'pt-br' ? 'Confirmar exclusão' : 'Confirm deletion',
    confirmDeleteMessage: language === 'pt-br' ? 'Deseja realmente remover este personagem?' : 'Do you really want to remove this character?',
    cancelDelete: language === 'pt-br' ? 'Cancelar' : 'Cancel',
    deleteLabel: language === 'pt-br' ? 'Excluir' : 'Delete',
    searchPlaceholder: language === 'pt-br' ? 'Buscar por nome ou classe...' : 'Search by name or class...',
    loadingCharacters: language === 'pt-br' ? 'Carregando personagens...' : 'Loading characters...',
    addCharacter: language === 'pt-br' ? 'Adicionar personagem' : 'Add character',
    noResults: language === 'pt-br' ? 'Nenhum personagem encontrado para sua busca.' : 'No characters found for your search.',
    searchButton: language === 'pt-br' ? 'Buscar' : 'Search',
    searchAria: language === 'pt-br' ? 'Buscar personagem' : 'Search character',
    summaryCharacters: language === 'pt-br' ? 'Personagens' : 'Characters',
    summaryClasses: language === 'pt-br' ? 'Classes presentes' : 'Classes present',
    summaryClassesEmpty: language === 'pt-br' ? 'Sem classes registradas' : 'No classes registered',
  }

  const personagensFiltrados = useMemo(() => {
    return personagens.filter((char) =>
      char.nome.toLowerCase().includes(busca.toLowerCase()) ||
      char.classe.toLowerCase().includes(busca.toLowerCase()),
    )
  }, [personagens, busca])

  const characterSummary = useMemo(() => {
    const byClass = personagensFiltrados.reduce((acc, character) => {
      const className = String(character.classe || '').trim() || (language === 'pt-br' ? 'Sem classe' : 'No class')
      acc[className] = (acc[className] || 0) + 1
      return acc
    }, {})

    return Object.entries(byClass)
      .map(([name, count]) => ({ name, count }))
      .sort((first, second) => second.count - first.count || first.name.localeCompare(second.name))
  }, [language, personagensFiltrados])

  function handleSelect(id) {
    navigate(`/jogar/${id}`, { state: { from: '/personagens' } })
  }

  function handleEdit(id) {
    navigate(`/jogar/${id}?modo=editar`, { state: { from: '/personagens' } })
  }

  function handleDelete(id) {
    setDeleteTargetId(id)
  }

  function handleCancelDelete() {
    setDeleteTargetId(null)
  }

  async function handleConfirmDelete() {
    if (deleteTargetId == null) return
    const deleted = await deleteCharacter(deleteTargetId)
    if (deleted) {
      setDeleteTargetId(null)
    }
  }

  async function handleAdd(values) {
    const created = await addCharacter(values)
    if (created) {
      setIsCreating(false)
    }
  }

  function handleCancel() {
    clearMensagem()
    setIsCreating(false)
  }

  return (
    <main>
      <section className="content-section">
        <div className="page-actions page-actions-compact">
          <SearchBar
            value={busca}
            onChange={setBusca}
            placeholder={strings.searchPlaceholder}
            buttonLabel={strings.searchButton}
            ariaLabel={strings.searchAria}
            actionLabel={strings.buttonNew}
            actionOnClick={() => setIsCreating(true)}
            onSubmit={(event) => event.preventDefault()}
            iconOnly
          />
        </div>

        {status === 'success' && personagensFiltrados.length > 0 && (
          <div className="session-overview">
            <div className="session-overview-cards">
              <article className="session-overview-card">
                <p>{strings.summaryCharacters}</p>
                <strong>{personagensFiltrados.length}</strong>
              </article>
              <article className="session-overview-card">
                <p>{strings.summaryClasses}</p>
                {characterSummary.length === 0 ? (
                  <strong>{strings.summaryClassesEmpty}</strong>
                ) : (
                  <div className="session-class-list">
                    {characterSummary.map((item) => (
                      <span key={item.name} className="session-class-chip">{item.name} <b>{item.count}</b></span>
                    ))}
                  </div>
                )}
              </article>
            </div>
          </div>
        )}

        {status === 'loading' && <LoadingIndicator message={strings.loadingCharacters} />}
        {status === 'error' && <div className="alert alert-error">{mensagem}</div>}
        {status === 'success' && mensagem && <div className="alert alert-success">{mensagem}</div>}

        {isCreating && (
          <CharacterForm
            onSubmit={handleAdd}
            onCancel={handleCancel}
            submitLabel={strings.addCharacter}
          />
        )}

        {status === 'success' && personagensFiltrados.length === 0 && (
          <div className="alert alert-warning">{strings.noResults}</div>
        )}

        <div className="cards-grid">
          {status === 'success' && personagensFiltrados.map((personagem) => (
            <CharacterCard
              key={personagem.id}
              character={personagem}
              onSelect={handleSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <ConfirmModal
          isOpen={deleteTargetId != null}
          title={strings.confirmDeleteTitle}
          message={strings.confirmDeleteMessage}
          cancelLabel={strings.cancelDelete}
          confirmLabel={strings.deleteLabel}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </section>
    </main>
  )
}
