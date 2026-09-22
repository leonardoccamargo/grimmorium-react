import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import LoadingIndicator from '../components/LoadingIndicator'
import SpellCard from '../components/SpellCard'
import SearchBar from '../components/SearchBar'
import { useLanguage } from '../context/LanguageContext.jsx'

const API_BASE = 'https://www.dnd5eapi.co/api/2014/spells'
const BACKEND_API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000').replace(/\/$/, '')

function mapPortugueseSpell(magia) {
  return {
    index: (magia.nome || '').toLowerCase().replace(/\s+/g, '-'),
    name: magia.nome,
    level: magia.nivel,
    school: { name: magia.escola },
    range: magia.alcance,
    components: (magia.componentes || '').split(',').map((c) => c.trim()).filter(Boolean),
    duration: magia.duracao,
    casting_time: magia.tempo,
    concentration: magia.concentracao,
    ritual: magia.ritual,
    desc: [magia.descricao],
    higher_level: [],
    classes: (magia.classes || []).map((classe) => ({ name: classe })),
    url: null,
  }
}

async function loadPortugueseSpells() {
  try {
    const response = await fetch(`${BACKEND_API_BASE}/api/magias`)
    if (!response.ok) throw new Error(`Falha ao carregar magias do backend (${response.status})`)
    const payload = await response.json()
    return (payload.magias || []).map(mapPortugueseSpell)
  } catch (error) {
    console.error('Falha no backend de magias, tentando JSON local.', error)
    try {
      const response = await fetch('/magias.json')
      if (!response.ok) {
        throw new Error(`Falha ao carregar magias locais (${response.status})`, { cause: error })
      }
      const data = await response.json()
      return data.map(mapPortugueseSpell)
    } catch (fallbackError) {
      console.error(fallbackError)
      return []
    }
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
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [schoolFilter, setSchoolFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [rangeFilter, setRangeFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' })
  const [currentPage, setCurrentPage] = useState(1)
  const [reloadToken, setReloadToken] = useState(0)
  const detailRef = useRef(null)
  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    let active = true

    async function fetchSpells() {
      setIndexStatus('loading')

      const spells = language === 'pt-br'
        ? await loadPortugueseSpells()
        : await loadEnglishSpellIndex()

      if (!active) return

      if (spells.length > 0) {
        setSpellIndexList(spells)
        setSelectedSpellIndex(null)
        setSelectedSpellDetails(null)
        setCurrentPage(1)
        setIndexStatus('success')
      } else {
        setSpellIndexList([])
        setSelectedSpellIndex(null)
        setSelectedSpellDetails(null)
        setIndexStatus('error')
      }
    }

    fetchSpells()
    return () => { active = false }
  }, [language, reloadToken])

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

  useEffect(() => {
    const isMatchingDetail = detailSpell?.index === selectedSpellIndex?.index
    if (!selectedSpellIndex || effectiveDetailStatus !== 'success' || !isMatchingDetail) {
      return undefined
    }

    if (!detailRef.current) return undefined

    detailRef.current.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' })
    return undefined
  }, [detailSpell, effectiveDetailStatus, selectedSpellIndex])

  const searchedSpells = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return spellIndexList
    }

    return spellIndexList.filter((spell) =>
      String(spell.name || '').toLowerCase().includes(normalizedSearch),
    )
  }, [searchTerm, spellIndexList])

  const filteredSpells = useMemo(
    () => filterSpellsByLevel(levelFilter, searchedSpells).filter((spell) => {
      const schoolMatches = schoolFilter === 'all' || spell.school?.name === schoolFilter
      const actionMatches = actionFilter === 'all' || spell.casting_time === actionFilter
      const rangeMatches = rangeFilter === 'all' || spell.range === rangeFilter
      return schoolMatches && actionMatches && rangeMatches
    }),
    [actionFilter, levelFilter, rangeFilter, schoolFilter, searchedSpells],
  )

  const sortedSpells = useMemo(() => {
    const collator = new Intl.Collator(language, { sensitivity: 'base', numeric: true })
    const spells = [...filteredSpells]

    spells.sort((firstSpell, secondSpell) => {
      const firstValue = sortConfig.key === 'level'
        ? firstSpell.level
        : firstSpell[sortConfig.key]?.name || firstSpell[sortConfig.key] || ''
      const secondValue = sortConfig.key === 'level'
        ? secondSpell.level
        : secondSpell[sortConfig.key]?.name || secondSpell[sortConfig.key] || ''
      const result = typeof firstValue === 'number' && typeof secondValue === 'number'
        ? firstValue - secondValue
        : collator.compare(String(firstValue), String(secondValue))

      return sortConfig.direction === 'ascending' ? result : -result
    })

    return spells
  }, [filteredSpells, language, sortConfig])

  const handleLevelFilterChange = (event) => {
    setLevelFilter(event.target.value)
    setCurrentPage(1)
    setSelectedSpellIndex(null)
    setSelectedSpellDetails(null)
    setDetailStatus('idle')
  }

  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value)
    setCurrentPage(1)
    setSelectedSpellIndex(null)
    setSelectedSpellDetails(null)
    setDetailStatus('idle')
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
    setSelectedSpellIndex(null)
    setSelectedSpellDetails(null)
    setDetailStatus('idle')
  }

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedSpells.length / ITEMS_PER_PAGE)),
    [sortedSpells],
  )

  const hasFilteredSpells = sortedSpells.length > 0

  const paginatedSpells = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return sortedSpells.slice(startIndex, endIndex)
  }, [currentPage, sortedSpells])

  const filterOptions = useMemo(() => ({
    schools: [...new Set(spellIndexList.map((spell) => spell.school?.name).filter(Boolean))].sort(),
    actions: [...new Set(spellIndexList.map((spell) => spell.casting_time).filter(Boolean))].sort(),
    ranges: [...new Set(spellIndexList.map((spell) => spell.range).filter(Boolean))].sort(),
  }), [spellIndexList])

  const handleSort = (key) => {
    setSortConfig((currentSort) => ({
      key,
      direction: currentSort.key === key && currentSort.direction === 'ascending'
        ? 'descending'
        : 'ascending',
    }))
    setCurrentPage(1)
  }

  const sortIndicator = (key) => {
    if (sortConfig.key !== key) return ''
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
  }

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
    filterLabel: language === 'pt-br' ? 'Nível' : 'Level',
    spellNameColumn: language === 'pt-br' ? 'Nome da magia' : 'Spell name',
    schoolFilterLabel: language === 'pt-br' ? 'Escola' : 'School',
    actionFilterLabel: language === 'pt-br' ? 'Ação' : 'Action',
    rangeFilterLabel: language === 'pt-br' ? 'Alcance' : 'Range',
    optionAll: language === 'pt-br' ? 'Todos' : 'All',
    optionCantrip: language === 'pt-br' ? 'Truques' : 'Cantrips',
    spellCount: language === 'pt-br' ? 'magias' : 'spells',
    schoolColumn: language === 'pt-br' ? 'Escola de magia' : 'Spell school',
    actionColumn: language === 'pt-br' ? 'Tipo de ação' : 'Action type',
    levelColumn: language === 'pt-br' ? 'Nível da magia' : 'Spell level',
    rangeColumn: language === 'pt-br' ? 'Alcance' : 'Range',
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
    noFilteredResults:
      language === 'pt-br'
        ? 'Nenhuma magia encontrada para o filtro selecionado.'
        : 'No spells found for the selected filter.',
    retryLoad:
      language === 'pt-br' ? 'Tentar novamente' : 'Try again',
  }

  const handleFirstPage = () => setCurrentPage(1)
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const handleLastPage = () => setCurrentPage(totalPages)

  const handleSpellSelect = (spell) => {
    if (selectedSpellIndex?.index === spell.index) {
      setSelectedSpellIndex(null)
      setSelectedSpellDetails(null)
      setDetailStatus('idle')
      return
    }

    setSelectedSpellIndex(spell)
  }

  const renderSpellDetailCard = (className = 'spell-detail-card') => {
    if (!detailSpell) return null

    return (
      <div className={className}>
        <h2>{detailSpell.name}</h2>
        <p className="spell-detail-meta">
          {strings.levelLabel} {detailSpell.level === 0 ? (language === 'pt-br' ? 'Truque' : 'Cantrip') : detailSpell.level}
          {' • '}
          {detailSpell.school?.name}
          {' • '}
          {strings.rangeLabel} {detailSpell.range}
        </p>

        <div className="spell-detail-info">
          <span>{detailSpell.components.join(', ')}</span>
          <span>{detailSpell.casting_time}</span>
          <span>{detailSpell.duration}</span>
          {detailSpell.concentration && <span>{strings.concentrationLabel}</span>}
        </div>

        <div className="spell-detail-description">
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
    )
  }

  return (
    <main>
      <section className="content-section">
        <div className="spell-toolbar">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={language === 'pt-br' ? 'Buscar magia por nome...' : 'Search spell by name...'}
            buttonLabel={language === 'pt-br' ? 'Buscar' : 'Search'}
            ariaLabel={language === 'pt-br' ? 'Buscar magia' : 'Search spell'}
            iconOnly
          />
          <div className="spell-filters">
            <label className="visually-hidden" htmlFor="spell-level-filter">{strings.filterLabel}</label>
            <select id="spell-level-filter" value={levelFilter} onChange={handleLevelFilterChange}>
              <option value="all">{strings.filterLabel}: {strings.optionAll}</option>
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
            <label className="visually-hidden" htmlFor="spell-school-filter">{strings.schoolFilterLabel}</label>
            <select id="spell-school-filter" value={schoolFilter} onChange={handleFilterChange(setSchoolFilter)}>
              <option value="all">{strings.schoolFilterLabel}: {strings.optionAll}</option>
              {filterOptions.schools.map((school) => <option key={school} value={school}>{school}</option>)}
            </select>
            <label className="visually-hidden" htmlFor="spell-action-filter">{strings.actionFilterLabel}</label>
            <select id="spell-action-filter" value={actionFilter} onChange={handleFilterChange(setActionFilter)}>
              <option value="all">{strings.actionFilterLabel}: {strings.optionAll}</option>
              {filterOptions.actions.map((action) => <option key={action} value={action}>{action}</option>)}
            </select>
            <label className="visually-hidden" htmlFor="spell-range-filter">{strings.rangeFilterLabel}</label>
            <select id="spell-range-filter" value={rangeFilter} onChange={handleFilterChange(setRangeFilter)}>
              <option value="all">{strings.rangeFilterLabel}: {strings.optionAll}</option>
              {filterOptions.ranges.map((range) => <option key={range} value={range}>{range}</option>)}
            </select>
          </div>
          <div className="spell-count">
            {indexStatus === 'success' && <span>{sortedSpells.length} {strings.spellCount}</span>}
          </div>
        </div>

        {indexStatus === 'loading' && <LoadingIndicator message={strings.loadingIndex} />}
        {indexStatus === 'error' && (
          <div className="alert alert-error">
            <p>{strings.loadError}</p>
            <div className="hook-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setReloadToken((prev) => prev + 1)}
              >
                {strings.retryLoad}
              </button>
            </div>
          </div>
        )}

        {indexStatus === 'success' && (
          <div className="spell-grid-layout">
            <div className="spell-list">
              {!hasFilteredSpells && (
                <div className="alert alert-warning">{strings.noFilteredResults}</div>
              )}

              {hasFilteredSpells && (
                <div className="spell-table-header">
                  <button className="spell-table-header-name" type="button" onClick={() => handleSort('name')} aria-label={`Sort by ${strings.spellNameColumn}`}>
                    {strings.spellNameColumn}{sortIndicator('name')}
                  </button>
                  <button type="button" onClick={() => handleSort('school')} aria-label={`Sort by ${strings.schoolColumn}`}>
                    {strings.schoolColumn}{sortIndicator('school')}
                  </button>
                  <button type="button" onClick={() => handleSort('casting_time')} aria-label={`Sort by ${strings.actionColumn}`}>
                    {strings.actionColumn}{sortIndicator('casting_time')}
                  </button>
                  <button type="button" onClick={() => handleSort('level')} aria-label={`Sort by ${strings.levelColumn}`}>
                    {strings.levelColumn}{sortIndicator('level')}
                  </button>
                  <button type="button" onClick={() => handleSort('range')} aria-label={`Sort by ${strings.rangeColumn}`}>
                    {strings.rangeColumn}{sortIndicator('range')}
                  </button>
                </div>
              )}

              <div className="cards-grid">
                {paginatedSpells.map((spell) => {
                  const isSelected = selectedSpellIndex?.index === spell.index

                  return (
                    <Fragment key={spell.index}>
                      <SpellCard
                        spell={spell}
                        isSelected={isSelected}
                        onSelect={() => handleSpellSelect(spell)}
                      />

                      {isSelected && (
                        <div
                          className="spell-detail-inline"
                          id={`spell-detail-${spell.index}`}
                          ref={detailRef}
                        >
                          {effectiveDetailStatus === 'loading' && <LoadingIndicator message={strings.loadingDetails} />}
                          {effectiveDetailStatus === 'error' && <div className="alert alert-error">{strings.errorDetail}</div>}
                          {effectiveDetailStatus !== 'loading' && effectiveDetailStatus !== 'error' && detailSpell && (
                            renderSpellDetailCard('spell-detail-card spell-detail-inline-card')
                          )}
                        </div>
                      )}
                    </Fragment>
                  )
                })}
              </div>
              {hasFilteredSpells && (
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
              )}
            </div>

          </div>
        )}
      </section>
    </main>
  )
}
