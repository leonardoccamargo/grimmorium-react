import { useEffect, useMemo, useState } from 'react'
import PageTitle from '../components/PageTitle'
import LoadingIndicator from '../components/LoadingIndicator'
import SpellCard from '../components/SpellCard'
import { useLanguage } from '../context/LanguageContext.jsx'

const API_BASE = 'https://www.dnd5eapi.co/api/2014/spells'

async function loadPortugueseSpells() {
  try {
    const response = await fetch('/magias.json')
    if (!response.ok) throw new Error(`Falha ao carregar magias (${response.status})`)
    const data = await response.json()
    
    return data.map((magia) => ({
      index: magia.nome.toLowerCase().replace(/\s+/g, '-'),
      name: magia.nome,
      level: magia.nivel,
      school: { name: magia.escola },
      range: magia.alcance,
      components: magia.componentes.split(', ').map((c) => c.trim()),
      duration: magia.duracao,
      casting_time: magia.tempo,
      concentration: magia.concentracao,
      ritual: magia.ritual,
      desc: [magia.descricao],
      higher_level: [],
      classes: magia.classes.map((classe) => ({ name: classe })),
      url: null,
    }))
  } catch (error) {
    console.error(error)
    return []
  }
}

async function loadEnglishSpellIndex() {
  try {
    const response = await fetch(API_BASE)
    if (!response.ok) throw new Error(`Falha ao carregar magias (${response.status})`)
    const data = await response.json()

    return data.results.map((spell) => ({
      ...spell,
      school: { name: '' },
      range: '',
      components: [],
      duration: '',
      casting_time: '',
      concentration: false,
      ritual: false,
      desc: [],
      higher_level: [],
    }))
  } catch (error) {
    console.error(error)
    return []
  }
}

async function loadEnglishSpellDetails(url) {
  try {
    const response = await fetch(`https://www.dnd5eapi.co${url}`)
    if (!response.ok) throw new Error(`Falha ao carregar detalhes (${response.status})`)
    return response.json()
  } catch (error) {
    console.error(error)
    return null
  }
}

function filterSpellsByLevel(levelFilter, spells) {
  return spells.filter((spell) => {
    if (levelFilter === 'all') return true
    if (levelFilter === 'cantrip') return spell.level === 0
    return spell.level === Number(levelFilter)
  })
}

function parseAverageDamage(damage, baseLevel) {
  if (!damage?.damage_at_slot_level) return null
  if (baseLevel == null) return null

  const formula = damage.damage_at_slot_level[String(baseLevel)]
  if (!formula) return null

  const match = formula.match(/(\d+)d(\d+)/)
  if (!match) return null

  const dice = Number(match[1])
  const faces = Number(match[2])
  const average = dice * (faces + 1) / 2

  return `${average.toFixed(1)}`
}

export default function GrimorioPage() {
  const { language } = useLanguage()
  const [spellIndexList, setSpellIndexList] = useState([])
  const [selectedSpellIndex, setSelectedSpellIndex] = useState(null)
  const [selectedSpellDetails, setSelectedSpellDetails] = useState(null)
  const [indexStatus, setIndexStatus] = useState('loading')
  const [detailStatus, setDetailStatus] = useState('idle')
  const [levelFilter, setLevelFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    async function fetchSpells() {
      setIndexStatus('loading')

      const spells = language === 'pt-br'
        ? await loadPortugueseSpells()
        : await loadEnglishSpellIndex()

      if (spells.length > 0) {
        setSpellIndexList(spells)
        setSelectedSpellIndex(null)
        setSelectedSpellDetails(null)
        setCurrentPage(1)
        setIndexStatus('success')
      } else {
        setIndexStatus('error')
      }
    }

    fetchSpells()
  }, [language])

  useEffect(() => {
    if (language !== 'en' || !selectedSpellIndex?.url) {
      return
    }

    let active = true

    async function fetchSpellDetails() {
      setDetailStatus('loading')
      const spellDetails = await loadEnglishSpellDetails(selectedSpellIndex.url)
      if (!active) return

      if (spellDetails) {
        setSelectedSpellDetails(spellDetails)
        setDetailStatus('success')
      } else {
        setDetailStatus('error')
      }
    }

    fetchSpellDetails()
    return () => { active = false }
  }, [language, selectedSpellIndex])

  const detailSpell = language === 'pt-br'
    ? selectedSpellIndex
    : selectedSpellDetails || null
  const effectiveDetailStatus = language === 'pt-br'
    ? (detailSpell ? 'success' : 'idle')
    : detailStatus

  const filteredSpells = useMemo(
    () => filterSpellsByLevel(levelFilter, spellIndexList),
    [levelFilter, spellIndexList],
  )

  const handleLevelFilterChange = (event) => {
    setLevelFilter(event.target.value)
    setCurrentPage(1)
  }

  const totalPages = useMemo(
    () => Math.ceil(filteredSpells.length / ITEMS_PER_PAGE),
    [filteredSpells],
  )

  const paginatedSpells = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredSpells.slice(startIndex, endIndex)
  }, [filteredSpells, currentPage])

  const averageDamage = useMemo(
    () => parseAverageDamage(detailSpell?.damage, detailSpell?.level),
    [detailSpell],
  )

  const strings = {
    title: language === 'pt-br' ? 'Grimório' : 'Spellbook',
    subtitle:
      language === 'pt-br'
        ? 'Explore magias D&D 5e com descrição, componentes, alcance e custo de slot.'
        : 'Browse D&D 5e spells with description, components, range and slot details.',
    filterLabel: language === 'pt-br' ? 'Filtrar por nível' : 'Filter by level',
    optionAll: language === 'pt-br' ? 'Todos' : 'All',
    optionCantrip: language === 'pt-br' ? 'Truques' : 'Cantrips',
    spellCount: language === 'pt-br' ? 'magias' : 'spells',
    selectPrompt:
      language === 'pt-br'
        ? 'Selecione uma magia para ver os detalhes completos.'
        : 'Select a spell to view full details.',
    levelLabel: language === 'pt-br' ? 'Nível' : 'Level',
    rangeLabel: language === 'pt-br' ? 'Alcance' : 'Range',
    descriptionLabel: language === 'pt-br' ? 'Descrição' : 'Description',
    higherSlotLabel:
      language === 'pt-br' ? 'Quando lançado com slot maior' : 'When cast with a higher slot',
    averageDamageLabel:
      language === 'pt-br' ? 'Dano médio por slot:' : 'Average damage per slot:',
    concentrationLabel:
      language === 'pt-br' ? 'Concentração' : 'Concentration',
    loadingDetails:
      language === 'pt-br' ? 'Carregando detalhes da magia...' : 'Loading spell details...',
    loadingIndex:
      language === 'pt-br' ? 'Carregando magias D&D 5e em português...' : 'Loading D&D 5e spells in English...',
    loadError:
      language === 'pt-br'
        ? 'Não foi possível carregar as magias. Tente novamente mais tarde.'
        : 'Unable to load spells. Try again later.',
    errorDetail:
      language === 'pt-br' ? 'Erro ao carregar a magia' : 'Failed to load spell details',
  }

  const handleFirstPage = () => setCurrentPage(1)
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const handleLastPage = () => setCurrentPage(totalPages)

  return (
    <main>
      <PageTitle
        title={strings.title}
        subtitle={strings.subtitle}
      />

      <section className="content-section">
        <div className="spell-actions">
          <div>
            <label htmlFor="spell-level-filter">{strings.filterLabel}</label>
            <select
              id="spell-level-filter"
              value={levelFilter}
              onChange={handleLevelFilterChange}
            >
              <option value="all">{strings.optionAll}</option>
              <option value="cantrip">{strings.optionCantrip}</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>
          </div>
          <div className="spell-count">
            {indexStatus === 'success' && <span>{filteredSpells.length} {strings.spellCount}</span>}
          </div>
        </div>

        {indexStatus === 'loading' && <LoadingIndicator message={strings.loadingIndex} />}
        {indexStatus === 'error' && <div className="alert alert-error">{strings.loadError}</div>}

        {indexStatus === 'success' && (
          <div className="spell-grid-layout">
            <div className="spell-list">
              <div className="cards-grid">
                {paginatedSpells.map((spell) => (
                  <SpellCard
                    key={spell.index}
                    spell={spell}
                    isSelected={selectedSpellIndex?.index === spell.index}
                    onSelect={() => setSelectedSpellIndex(spell)}
                    details={selectedSpellIndex?.index === spell.index ? detailSpell : null}
                    averageDamage={selectedSpellIndex?.index === spell.index ? averageDamage : null}
                    emptySummary={language === 'pt-br'
                      ? 'Selecione para ver descrição e componentes.'
                      : 'Select to view description and components.'}
                  />
                ))}
              </div>
              <div className="pagination-controls">
                <button
                  type="button"
                  className="btn-pagination"
                  onClick={handleFirstPage}
                  disabled={currentPage === 1}
                  aria-label={language === 'pt-br' ? 'Primeira página' : 'First page'}
                  title={language === 'pt-br' ? 'Primeira página' : 'First page'}
                >
                  ⏮
                </button>
                <button
                  type="button"
                  className="btn-pagination"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  aria-label={language === 'pt-br' ? 'Página anterior' : 'Previous page'}
                  title={language === 'pt-br' ? 'Página anterior' : 'Previous page'}
                >
                  ◀
                </button>
                <span className="pagination-info">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  className="btn-pagination"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  aria-label={language === 'pt-br' ? 'Próxima página' : 'Next page'}
                  title={language === 'pt-br' ? 'Próxima página' : 'Next page'}
                >
                  ▶
                </button>
                <button
                  type="button"
                  className="btn-pagination"
                  onClick={handleLastPage}
                  disabled={currentPage === totalPages}
                  aria-label={language === 'pt-br' ? 'Última página' : 'Last page'}
                  title={language === 'pt-br' ? 'Última página' : 'Last page'}
                >
                  ⏭
                </button>
              </div>
            </div>

            <aside className="spell-detail-panel">
              {effectiveDetailStatus === 'loading' && <LoadingIndicator message={strings.loadingDetails} />}
              {effectiveDetailStatus === 'error' && <div className="alert alert-error">{strings.errorDetail}</div>}
              {effectiveDetailStatus !== 'loading' && effectiveDetailStatus !== 'error' && detailSpell && (
                <div className="spell-detail-card">
                  <h2>{detailSpell.name}</h2>
                  <p className="spell-detail-meta">
                    {strings.levelLabel} {detailSpell.level === 0 ? (language === 'pt-br' ? 'Truque' : 'Cantrip') : detailSpell.level}
                    {' • '}
                    {detailSpell.school?.name}
                    {' • '}
                    {strings.rangeLabel} {detailSpell.range}
                  </p>

                  <div className="spell-detail-tags">
                    <span>{detailSpell.components.join(', ')}</span>
                    <span>{detailSpell.casting_time}</span>
                    <span>{detailSpell.duration}</span>
                      {detailSpell.concentration && <span>{strings.concentrationLabel}</span>}
                    {detailSpell.desc.map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>

                  {detailSpell.higher_level?.length > 0 && (
                    <div className="spell-detail-section">
                      <strong>{strings.higherSlotLabel}</strong>
                      {detailSpell.higher_level.map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  )}

                  {averageDamage && (
                    <div className="spell-detail-summary">
                      <strong>{strings.averageDamageLabel}</strong> {averageDamage}
                    </div>
                  )}
                </div>
              )}
              {effectiveDetailStatus === 'idle' && !detailSpell && (
                <div className="spell-detail-empty">
                  <p>{strings.selectPrompt}</p>
                </div>
              )}
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}
