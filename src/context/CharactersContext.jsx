/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLanguage } from './LanguageContext.jsx'
import { parseHpString } from '../utils/characterHealth.js'

const CharactersContext = createContext(null)
const STORAGE_KEY = 'atlas-arcano-personagens'
const DATA_MODE = String(import.meta.env.VITE_CHARACTERS_DATA_MODE || 'mock').toLowerCase()
const IS_API_MODE = DATA_MODE === 'api'
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000').replace(/\/$/, '')

const HIT_DICE_BY_CLASS = {
  barbaro: 12,
  guerreiro: 10,
  paladino: 10,
  patrulheiro: 10,
  artificie: 8,
  artifice: 8,
  bardo: 8,
  clerigo: 8,
  druida: 8,
  monge: 8,
  ladino: 8,
  bruxo: 8,
  mago: 6,
  feiticeiro: 6,
}

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function getHitDie(className) {
  return HIT_DICE_BY_CLASS[normalizeText(className)] || 8
}

function mapSlotsToFrontend(slotRows = []) {
  const findSlot = (level) => slotRows.find((slot) => slot.slot_level === level)
  return {
    nivel1: findSlot(1)?.max_slots ?? 0,
    nivel2: findSlot(2)?.max_slots ?? 0,
    nivel3: findSlot(3)?.max_slots ?? 0,
  }
}

function mapV2CharacterToFrontend(character) {
  const hpCurrent = character.vitals?.hp_current ?? 0
  const hpMax = character.vitals?.hp_max ?? 0

  return {
    id: character.id,
    nome: character.name,
    classe: character.character_class,
    nivel: character.level,
    constituicao: character.abilities?.con?.total ?? 10,
    hp: `${hpCurrent}/${hpMax}`,
    ca: character.vitals?.ac_current ?? character.vitals?.ac_base ?? 10,
    slots_magia: mapSlotsToFrontend(character.spell_slots),
    consumiveis: (character.inventory || []).map((item) => item.name),
  }
}

const getStoredCharacters = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let payload
  try {
    payload = await response.json()
  } catch {
    payload = undefined
  }

  if (!response.ok) {
    const message = payload?.message || 'API request failed.'
    throw new Error(message)
  }

  return payload
}

function buildWizardPayload(character) {
  const nivel = Number(character.nivel) || 1
  const constituicao = Number(character.constituicao) || 10
  const ca = Number(character.ca) || 10
  const { current, max } = parseHpString(character.hp)

  return {
    name: character.nome,
    campaign: null,
    level: nivel,
    race: 'Humano',
    subrace: null,
    character_class: character.classe,
    hit_die: getHitDie(character.classe),
    alignment: null,
    background: 'Aventureiro',
    personality_traits: '',
    ideals: '',
    bonds: '',
    flaws: '',
    hp_max: Math.max(1, max || current || 10),
    hp_current: Math.max(0, current || max || 10),
    hp_temp: 0,
    ac_base: Math.max(1, ca),
    speed: 30,
    coins_cp: 0,
    coins_sp: 0,
    coins_ep: 0,
    coins_gp: 0,
    coins_pp: 0,
    abilities: {
      str_base: 10,
      dex_base: 10,
      con_base: constituicao,
      int_base: 10,
      wis_base: 10,
      cha_base: 10,
      str_racial: 0,
      dex_racial: 0,
      con_racial: 0,
      int_racial: 0,
      wis_racial: 0,
      cha_racial: 0,
    },
    spell_slots: [
      {
        slot_level: 1,
        max_slots: Number(character.slots_magia?.nivel1) || 0,
        used_slots: 0,
      },
      {
        slot_level: 2,
        max_slots: Number(character.slots_magia?.nivel2) || 0,
        used_slots: 0,
      },
      {
        slot_level: 3,
        max_slots: Number(character.slots_magia?.nivel3) || 0,
        used_slots: 0,
      },
    ],
    inventory: (character.consumiveis || []).map((itemName) => ({
      name: itemName,
      category: 'Consumivel',
      quantity: 1,
      weight: 0,
      price_gp: 0,
      is_equipped: false,
      grants_ac: 0,
      requires_attunement: false,
      is_attuned: false,
      source: 'manual',
    })),
  }
}

export function CharactersProvider({ children }) {
  const { language } = useLanguage()
  const [personagens, setPersonagens] = useState(() => (IS_API_MODE ? [] : (getStoredCharacters() || [])))
  const [status, setStatus] = useState(() => (IS_API_MODE ? 'loading' : (getStoredCharacters() ? 'success' : 'loading')))
  const [mensagemKey, setMensagemKey] = useState(null)

  const mensagem = useMemo(() => {
    switch (mensagemKey) {
      case 'load-error':
        return language === 'pt-br'
          ? 'Erro ao carregar os personagens. Tente novamente mais tarde.'
          : 'Failed to load characters. Please try again later.'
      case 'character-added':
        return language === 'pt-br'
          ? 'Personagem adicionado com sucesso.'
          : 'Character added successfully.'
      case 'character-updated':
        return language === 'pt-br'
          ? 'Ficha atualizada com sucesso.'
          : 'Sheet updated successfully.'
      case 'character-deleted':
        return language === 'pt-br'
          ? 'Personagem removido com sucesso.'
          : 'Character removed successfully.'
      case 'character-sync-error':
        return language === 'pt-br'
          ? 'Não foi possível sincronizar com o backend. Verifique se a API está ativa em http://127.0.0.1:5000.'
          : 'Could not sync with backend. Ensure API is running at http://127.0.0.1:5000.'
      default:
        return ''
    }
  }, [mensagemKey, language])

  useEffect(() => {
    async function loadCharacters() {
      if (!IS_API_MODE) {
        const storedCharacters = getStoredCharacters()
        if (storedCharacters) {
          setPersonagens(storedCharacters)
          setStatus('success')
          return
        }

        try {
          setStatus('loading')
          const response = await fetch('/personagens.json')
          if (!response.ok) throw new Error('Falha ao carregar personagens locais')
          const data = await response.json()
          setPersonagens(data)
          setStatus('success')
        } catch {
          setMensagemKey('load-error')
          setStatus('error')
        }
        return
      }

      try {
        setStatus('loading')
        const response = await apiRequest('/api/v2/characters')
        const mapped = (response.characters || []).map(mapV2CharacterToFrontend)
        setPersonagens(mapped)
        setStatus('success')
      } catch {
        setMensagemKey('character-sync-error')
        setStatus('error')
      }
    }

    loadCharacters()
  }, [])

  const refreshCharacters = async () => {
    if (!IS_API_MODE) return
    const response = await apiRequest('/api/v2/characters')
    const mapped = (response.characters || []).map(mapV2CharacterToFrontend)
    setPersonagens(mapped)
  }

  useEffect(() => {
    if (!IS_API_MODE && status === 'success') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(personagens))
    }
  }, [personagens, status])

  const addCharacter = async (character) => {
    if (!IS_API_MODE) {
      const newCharacter = {
        ...character,
        id: Date.now(),
      }
      setPersonagens((prev) => [...prev, newCharacter])
      setMensagemKey('character-added')
      return true
    }

    try {
      const payload = buildWizardPayload(character)
      await apiRequest('/api/v2/characters/wizard', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      await refreshCharacters()
      setMensagemKey('character-added')
      return true
    } catch {
      setMensagemKey('character-sync-error')
      return false
    }
  }

  const updateCharacter = async (updatedCharacter) => {
    if (!IS_API_MODE) {
      setPersonagens((prev) => prev.map((personagem) => (
        personagem.id === updatedCharacter.id ? updatedCharacter : personagem
      )))
      setMensagemKey('character-updated')
      return true
    }

    const { current, max } = parseHpString(updatedCharacter.hp)
    const hpCurrent = Math.max(0, Math.min(current, max))

    try {
      await apiRequest(`/api/v2/characters/${updatedCharacter.id}/play`, {
        method: 'PUT',
        body: JSON.stringify({
          hp_current: hpCurrent,
          ac_base: Number(updatedCharacter.ca) || 10,
        }),
      })

      const slotEntries = [
        { level: 1, used: Number(updatedCharacter.slots_magia?.nivel1) || 0 },
        { level: 2, used: Number(updatedCharacter.slots_magia?.nivel2) || 0 },
        { level: 3, used: Number(updatedCharacter.slots_magia?.nivel3) || 0 },
      ]

      await Promise.all(slotEntries.map((entry) => (
        apiRequest(`/api/v2/characters/${updatedCharacter.id}/spell-slots/${entry.level}`, {
          method: 'PUT',
          body: JSON.stringify({ used_slots: entry.used }),
        }).catch(() => null)
      )))

      await refreshCharacters()
      setMensagemKey('character-updated')
      return true
    } catch {
      setMensagemKey('character-sync-error')
      return false
    }
  }

  const deleteCharacter = async (id) => {
    if (!IS_API_MODE) {
      setPersonagens((prev) => prev.filter((personagem) => personagem.id !== id))
      setMensagemKey('character-deleted')
      return true
    }

    try {
      await apiRequest(`/api/v2/characters/${id}`, { method: 'DELETE' })
      setPersonagens((prev) => prev.filter((personagem) => personagem.id !== id))
      setMensagemKey('character-deleted')
      return true
    } catch {
      setMensagemKey('character-sync-error')
      return false
    }
  }

  const clearMensagem = () => setMensagemKey(null)

  return (
    <CharactersContext.Provider value={{ personagens, status, mensagem, addCharacter, updateCharacter, deleteCharacter, clearMensagem, dataMode: DATA_MODE }}>
      {children}
    </CharactersContext.Provider>
  )
}

export function useCharacters() {
  const context = useContext(CharactersContext)
  if (!context) {
    throw new Error('useCharacters must be used within a CharactersProvider')
  }
  return context
}
