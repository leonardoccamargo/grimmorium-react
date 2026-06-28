/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLanguage } from './LanguageContext.jsx'

const CharactersContext = createContext(null)
const STORAGE_KEY = 'atlas-arcano-personagens'

const getStoredCharacters = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function CharactersProvider({ children }) {
  const { language } = useLanguage()
  const [storedCharacters] = useState(getStoredCharacters)
  const [personagens, setPersonagens] = useState(() => storedCharacters ?? [])
  const [status, setStatus] = useState(() => (storedCharacters ? 'success' : 'loading'))
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
      default:
        return ''
    }
  }, [mensagemKey, language])

  useEffect(() => {
    if (storedCharacters) return

    fetch('/personagens.json')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar personagens.')
        return res.json()
      })
      .then((data) => {
        setPersonagens(data)
        setStatus('success')
      })
      .catch(() => {
        setMensagemKey('load-error')
        setStatus('error')
      })
  }, [storedCharacters])

  useEffect(() => {
    if (status === 'success') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(personagens))
    }
  }, [personagens, status])

  const addCharacter = (character) => {
    const newCharacter = {
      ...character,
      id: Date.now(),
    }
    setPersonagens((prev) => [...prev, newCharacter])
    setMensagemKey('character-added')
  }

  const updateCharacter = (updatedCharacter) => {
    setPersonagens((prev) => prev.map((personagem) => (
      personagem.id === updatedCharacter.id ? updatedCharacter : personagem
    )))
    setMensagemKey('character-updated')
  }

  const deleteCharacter = (id) => {
    setPersonagens((prev) => prev.filter((personagem) => personagem.id !== id))
    setMensagemKey('character-deleted')
  }

  const clearMensagem = () => setMensagemKey(null)

  return (
    <CharactersContext.Provider value={{ personagens, status, mensagem, addCharacter, updateCharacter, deleteCharacter, clearMensagem }}>
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
