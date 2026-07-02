const STORAGE_KEY = 'filina_stelle'

export function getChiaviGuadagnate() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function salvaChiavi(keys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
}

export function stellaGiaGuadagnata(key) {
  return getChiaviGuadagnate().includes(key)
}

export function registraStella(key) {
  const keys = getChiaviGuadagnate()
  if (!keys.includes(key)) {
    keys.push(key)
    salvaChiavi(keys)
    return true
  }
  return false
}

const moduli = [
  { id: 'animali',        tipo: 'giochi/animali',        nome: 'Animali',                icona: '🐾', colore: '#FF6B6B',  totale: 12 },
  { id: 'colori',         tipo: 'giochi/colori',         nome: 'Colori',                icona: '🎨', colore: '#4ECDC4',  totale: 10 },
  { id: 'numeri',         tipo: 'giochi/numeri',         nome: 'Numeri',                icona: '🔢', colore: '#D68910',  totale: 10 },
  { id: 'cibo',           tipo: 'giochi/cibo',           nome: 'Cibo',                  icona: '🍕', colore: '#FF8C42',  totale: 10 },
  { id: 'vestiti',        tipo: 'giochi/vestiti',        nome: 'Vestiti',               icona: '👕', colore: '#A66CFF',  totale: 10 },
  { id: 'corpo',          tipo: 'giochi/corpo',          nome: 'Corpo',                 icona: '🖐️', colore: '#FF6B9D',  totale: 10 },
  { id: 'famiglia',       tipo: 'giochi/famiglia',       nome: 'Famiglia',              icona: '👨‍👩‍👧‍👦', colore: '#45B7D1',  totale: 10 },
  { id: 'articoli',       tipo: 'esercizi/articoli',             nome: 'Articoli',                icona: '📝', colore: '#4ECDC4',  totale: 80 },
  { id: 'congiunzioni',   tipo: 'esercizi/congiunzioni',         nome: 'Congiunzioni',            icona: '🔀', colore: '#E17055',  totale: 20 },
  { id: 'preposizioni-articolate',  tipo: 'esercizi/preposizioni-articolate',  nome: 'Preposizioni Articolate',    icona: '🔗', colore: '#FF8C42',  totale: 20 },
  { id: 'preposizioni-semplici',    tipo: 'esercizi/preposizioni-semplici',    nome: 'Preposizioni Semplici',      icona: '➡️', colore: '#6C5CE7',  totale: 20 },
  { id: 'folletto-dei-regali',     tipo: 'storie/folletto-dei-regali',       nome: 'Il folletto dei regali',     icona: '🧝', colore: '#A66CFF',  totale: 4 },
  { id: 'panda-pandino',            tipo: 'storie/panda-pandino',              nome: 'Panda Pandino',            icona: '🐼', colore: '#2ECC71',  totale: 4 },
  { id: 'verbi',                    tipo: 'esercizi/verbi',                    nome: 'Verbi al Presente',        icona: '🏃', colore: '#00B894',  totale: 20 },
  { id: 'aggettivi',                tipo: 'esercizi/aggettivi',                nome: 'Aggettivi',                icona: '🎨', colore: '#FD79A8',  totale: 20 },
  { id: 'pronomi',                  tipo: 'esercizi/pronomi',                  nome: 'Pronomi',                  icona: '🔄', colore: '#0984E3',  totale: 20 },
  { id: 'possessivi',               tipo: 'esercizi/possessivi',               nome: 'Possessivi',               icona: '👤', colore: '#6C5CE7',  totale: 20 },
  { id: 'avverbi',                  tipo: 'esercizi/avverbi',                  nome: 'Avverbi di Frequenza',     icona: '⏰', colore: '#FDCB6E',  totale: 20 },
  { id: 'passato-prossimo',         tipo: 'esercizi/passato-prossimo',        nome: 'Passato Prossimo',         icona: '⏪', colore: '#E17055',  totale: 20 },
  { id: 'preposizioni-tempo-luogo', tipo: 'esercizi/preposizioni-tempo-luogo',nome: 'Prep. Tempo e Luogo',      icona: '📍', colore: '#00CEC9',  totale: 20 },
]

export function getStatisticheModuli() {
  const chiavi = getChiaviGuadagnate()
  return moduli.map((m) => {
    const ottenute = chiavi.filter((k) => k.startsWith(m.tipo + '/')).length
    return { ...m, ottenute }
  })
}

export function getTotalePossibile() {
  return moduli.reduce((sum, m) => sum + m.totale, 0)
}

export function resettaStelle() {
  localStorage.removeItem(STORAGE_KEY)
}
