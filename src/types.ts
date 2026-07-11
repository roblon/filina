export interface Parola {
  parola: string
  articolo: string
  emoji: string
}

export interface CategoriaVocabolario {
  id: string
  nome: string
  icona: string
  colore: string
  livello?: number
  descrizione?: string
  parole: Parola[]
}

export interface Esercizio {
  frase: string
  emoji: string
  [campo: string]: string | number
}

export interface ModuloEsercizio {
  id: string
  nome: string
  icona: string
  colore: string
  esercizi: Esercizio[]
}

export interface DomandaStoria {
  domanda: string
  opzioni: string[]
  corretta: number
}

export interface Storia {
  id: string
  nome: string
  icona: string
  colore: string
  video: string
  domande: DomandaStoria[]
}

export interface RispostaQuiz {
  domanda?: string
  corretta: boolean
  rispostaCorretta: string
  rispostaData: string
  valoreSbagliato?: string | null
}

export interface CategoriaEsercizio {
  id: string
  nome: string
  icona: string
  colore: string
  descrizione?: string
  livello?: number
}

export interface ModuloStelle {
  id: string
  nome: string
  icona: string
  colore: string
  totale: number
  livello?: number
  ottenute?: number
}

export interface SezioneStelle {
  id: string
  nome: string
  icona: string
  colore: string
  moduli: ModuloStelle[]
}
