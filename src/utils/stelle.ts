import type { SezioneStelle } from '../types'

const STORAGE_KEY = 'filina_stelle'

export function getChiaviGuadagnate(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function salvaChiavi(keys: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
}

export function stellaGiaGuadagnata(key: string): boolean {
  return getChiaviGuadagnate().includes(key)
}

export function registraStella(key: string): boolean {
  const keys = getChiaviGuadagnate()
  if (!keys.includes(key)) {
    keys.push(key)
    salvaChiavi(keys)
    return true
  }
  return false
}

const sezioni: SezioneStelle[] = [
  {
    id: 'giochi',
    nome: 'Giochi',
    icona: '🎮',
    colore: '#e17055',
    moduli: [
      { id: 'animali',    nome: 'Animali',     icona: '🐾', colore: '#FF6B6B',  totale: 12, livello: 1 },
      { id: 'colori',     nome: 'Colori',      icona: '🎨', colore: '#4ECDC4',  totale: 10, livello: 1 },
      { id: 'numeri',     nome: 'Numeri',      icona: '🔢', colore: '#D68910',  totale: 10, livello: 1 },
      { id: 'cibo',       nome: 'Cibo',        icona: '🍕', colore: '#FF8C42',  totale: 10, livello: 1 },
      { id: 'vestiti',    nome: 'Vestiti',     icona: '👕', colore: '#A66CFF',  totale: 10, livello: 1 },
      { id: 'corpo',      nome: 'Corpo',       icona: '🖐️', colore: '#FF6B9D',  totale: 10, livello: 1 },
      { id: 'famiglia',   nome: 'Famiglia',    icona: '👨‍👩‍👧‍👦', colore: '#45B7D1',  totale: 10, livello: 1 },
      { id: 'calendario', nome: 'Calendario',  icona: '📅', colore: '#E17055',  totale: 8,  livello: 2 },
      { id: 'orologio',   nome: 'Orologio',    icona: '⏰', colore: '#0984E3',  totale: 12, livello: 2 },
    ],
  },
  {
    id: 'grammatica',
    nome: 'Grammatica',
    icona: '✍️',
    colore: '#6c5ce7',
    moduli: [
      { id: 'articoli',                  nome: 'Articoli',              icona: '📝', colore: '#4ECDC4',  totale: 72 },
      { id: 'preposizioni-semplici',     nome: 'Prep. Semplici',        icona: '➡️', colore: '#6C5CE7',  totale: 20 },
      { id: 'preposizioni-articolate',   nome: 'Prep. Articolate',      icona: '🔗', colore: '#FF8C42',  totale: 20 },
      { id: 'congiunzioni',              nome: 'Congiunzioni',          icona: '🔀', colore: '#E17055',  totale: 20 },
      { id: 'verbi',                     nome: 'Verbi al Presente',     icona: '🏃', colore: '#00B894',  totale: 20 },
      { id: 'aggettivi',                 nome: 'Aggettivi',             icona: '🎨', colore: '#FD79A8',  totale: 20 },
      { id: 'pronomi',                   nome: 'Pronomi',               icona: '🔄', colore: '#0984E3',  totale: 20 },
      { id: 'possessivi',                nome: 'Possessivi',            icona: '👤', colore: '#6C5CE7',  totale: 20 },
      { id: 'avverbi',                   nome: 'Avverbi di Frequenza',  icona: '⏰', colore: '#FDCB6E',  totale: 20 },
      { id: 'passato-prossimo',          nome: 'Passato Prossimo',      icona: '⏪', colore: '#E17055',  totale: 20 },
      { id: 'preposizioni-tempo-luogo',  nome: 'Prep. Tempo e Luogo',   icona: '📍', colore: '#00CEC9',  totale: 20 },
    ],
  },
  {
    id: 'storie',
    nome: 'Storie',
    icona: '📖',
    colore: '#00b894',
    moduli: [
      { id: 'folletto-dei-regali', nome: 'Il folletto dei regali', icona: '🧝', colore: '#A66CFF', totale: 4 },
      { id: 'panda-pandino',      nome: 'Panda Pandino',          icona: '🐼', colore: '#2ECC71', totale: 4 },
    ],
  },
]

function calcolaOttenute(sezioneId: string, moduleId: string): number {
  const chiavi = getChiaviGuadagnate()
  const prefisso = `${sezioneId}/${moduleId}/`
  return chiavi.filter((k) => k.startsWith(prefisso)).length
}

export function getSezioni() {
  return sezioni.map((s) => ({
    ...s,
    moduli: s.moduli.map((m) => ({
      ...m,
      ottenute: calcolaOttenute(s.id, m.id),
    })),
  }))
}

export function getStatisticheModuli() {
  return getSezioni().flatMap((s) => s.moduli)
}

export function getTotalePossibile(): number {
  return sezioni.reduce(
    (sum, s) => sum + s.moduli.reduce((s2, m) => s2 + m.totale, 0),
    0,
  )
}

export function resettaStelle(): void {
  localStorage.removeItem(STORAGE_KEY)
}
