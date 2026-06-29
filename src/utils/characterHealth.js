const CLASS_HP_RULES = {
  barbaro: { label: 'Bárbaro', maxDie: 12, fixedValue: 7 },
  guerreiro: { label: 'Guerreiro', maxDie: 10, fixedValue: 6 },
  paladino: { label: 'Paladino', maxDie: 10, fixedValue: 6 },
  patrulheiro: { label: 'Patrulheiro', maxDie: 10, fixedValue: 6 },
  artificie: { label: 'Artífice', maxDie: 8, fixedValue: 5 },
  artifice: { label: 'Artífice', maxDie: 8, fixedValue: 5 },
  bardo: { label: 'Bardo', maxDie: 8, fixedValue: 5 },
  clerigo: { label: 'Clérigo', maxDie: 8, fixedValue: 5 },
  clérigo: { label: 'Clérigo', maxDie: 8, fixedValue: 5 },
  druida: { label: 'Druida', maxDie: 8, fixedValue: 5 },
  monge: { label: 'Monge', maxDie: 8, fixedValue: 5 },
  ladino: { label: 'Ladino', maxDie: 8, fixedValue: 5 },
  bruxo: { label: 'Bruxo', maxDie: 8, fixedValue: 5 },
  mago: { label: 'Mago', maxDie: 6, fixedValue: 4 },
  feiticeiro: { label: 'Feiticeiro', maxDie: 6, fixedValue: 4 },
}

export const SUPPORTED_DND5E_CLASSES = [
  'Bárbaro',
  'Guerreiro',
  'Paladino',
  'Patrulheiro',
  'Artífice',
  'Bardo',
  'Clérigo',
  'Druida',
  'Monge',
  'Ladino',
  'Bruxo',
  'Mago',
  'Feiticeiro',
]

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function getClassRule(className) {
  const normalizedClass = normalizeText(className)
  const rule = CLASS_HP_RULES[normalizedClass]

  if (!rule) {
    throw new Error('Classe não encontrada.')
  }

  return rule
}

export function calculateCharacterMaxHp(
  className,
  level,
  constitutionValue,
  useFixedValue = true,
  bonusHpPerLevel = 0,
) {
  const resolvedLevel = Number(level)
  const resolvedConstitution = Number(constitutionValue)
  const resolvedBonus = Number(bonusHpPerLevel)

  if (!Number.isInteger(resolvedLevel) || resolvedLevel < 1) {
    throw new Error('Nível inválido.')
  }

  if (!Number.isInteger(resolvedConstitution)) {
    throw new Error('Constituição inválida.')
  }

  const rule = getClassRule(className)
  const constitutionModifier = Math.floor((resolvedConstitution - 10) / 2)
  let totalHp = rule.maxDie + constitutionModifier

  if (resolvedLevel > 1) {
    if (useFixedValue) {
      totalHp += (resolvedLevel - 1) * (rule.fixedValue + constitutionModifier)
    } else {
      for (let currentLevel = 2; currentLevel <= resolvedLevel; currentLevel += 1) {
        const rolledDie = Math.floor(Math.random() * rule.maxDie) + 1
        totalHp += rolledDie + constitutionModifier
      }
    }
  }

  totalHp += resolvedBonus * resolvedLevel

  return Math.trunc(totalHp)
}

export function parseHpString(hpValue) {
  const [currentValue = '0', maxValue = '0'] = String(hpValue ?? '0/0').split('/')
  const current = Number(currentValue)
  const max = Number(maxValue)

  return {
    current: Number.isFinite(current) ? current : 0,
    max: Number.isFinite(max) ? max : 0,
  }
}

export function formatHpString(currentHp, maxHp) {
  const resolvedCurrent = Math.max(0, Math.trunc(Number(currentHp) || 0))
  const resolvedMax = Math.max(0, Math.trunc(Number(maxHp) || 0))

  return `${resolvedCurrent}/${resolvedMax}`
}

export function clampHpToMax(currentHp, maxHp) {
  const resolvedCurrent = Math.max(0, Math.trunc(Number(currentHp) || 0))
  const resolvedMax = Math.max(0, Math.trunc(Number(maxHp) || 0))

  return Math.min(resolvedCurrent, resolvedMax)
}

export function resolveCharacterMaxHp(character, fallbackMax = 0) {
  const parsedFallback = Math.max(0, Math.trunc(Number(fallbackMax) || 0))

  try {
    if (!character?.constituicao) {
      return parsedFallback
    }

    return calculateCharacterMaxHp(
      character.classe,
      character.nivel,
      character.constituicao,
      true,
      0,
    )
  } catch {
    return parsedFallback
  }
}
