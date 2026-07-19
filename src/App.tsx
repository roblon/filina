import { useState, useEffect } from 'react'
import ThemeMenu from './components/ThemeMenu'
import Home from './components/Home'
import Game from './components/Game'
import ArticoliGame from './components/ArticoliGame'
import PreposizioniGame from './components/PreposizioniGame'
import GrammarGame from './components/GrammarGame'
import esercizioCongiunzioni from './data/congiunzioni'
import esercizioPreposizioniSemplici from './data/preposizioni-semplici'
import StoriaGame from './components/StoriaGame'
import CalendarioGame from './components/CalendarioGame'
import OrologioGame from './components/OrologioGame'
import DitaGame from './components/DitaGame'
import Placeholder from './components/Placeholder'
import StarsCounter from './components/StarsCounter'
import StarsModal from './components/StarsModal'
import UserMenu from './components/UserMenu'
import storie from './data/storie'
import esercizioVerbi from './data/verbi'
import esercizioAggettivi from './data/aggettivi'
import esercizioPronomi from './data/pronomi'
import esercizioPossessivi from './data/possessivi'
import esercizioAvverbi from './data/avverbi'
import esercizioPassatoProssimo from './data/passato-prossimo'
import esercizioPreposizioniTempoLuogo from './data/preposizioni-tempo-luogo'
import { getChiaviGuadagnate, registraStella } from './utils/stelle'
import { getUserProfile, saveUserProfile } from './utils/userProfile'
import { setAudioEnabled } from './utils/tts'
import datiCalendario from './data/calendario'
import datiOrologio from './data/orologio'
import datiDita from './data/dita'
import categorieVocabolario from './data/vocabolario'
import { playStarSound } from './utils/tts'
import type { CategoriaEsercizio, Storia, UserProfile } from './types'
import './shared.css'

const categorieEsercizi: CategoriaEsercizio[] = [
  { id: 'articoli', nome: 'Articoli', icona: '📝', colore: '#4ECDC4', descrizione: 'Impara gli articoli determinativi e indeterminativi' },
  { id: 'preposizioni-semplici', nome: 'Preposizioni Semplici', icona: '➡️', colore: '#6C5CE7', descrizione: 'Impara le preposizioni semplici (di, a, da, in, con, su, per, tra, fra)' },
  { id: 'preposizioni', nome: 'Preposizioni Articolate', icona: '🔗', colore: '#FF8C42', descrizione: 'Impara le preposizioni articolate (al, del, nel, dal, sul…)' },
  { id: 'congiunzioni', nome: 'Congiunzioni', icona: '🔀', colore: '#E17055', descrizione: 'Impara le congiunzioni (e, ma, perché, se, mentre, però, che…)' },
  { id: 'verbi', nome: 'Verbi al Presente', icona: '🏃', colore: '#00B894', descrizione: 'Coniuga i verbi al presente (-are, -ere, -ire)' },
  { id: 'aggettivi', nome: 'Aggettivi', icona: '🎨', colore: '#FD79A8', descrizione: 'Accorda gli aggettivi con nome e genere' },
  { id: 'pronomi', nome: 'Pronomi', icona: '🔄', colore: '#0984E3', descrizione: 'Pronomi diretti e indiretti (mi, ti, lo, la, gli, le…)' },
  { id: 'possessivi', nome: 'Possessivi', icona: '👤', colore: '#6C5CE7', descrizione: 'Aggettivi possessivi (mio, tuo, suo, nostro, vostro)' },
  { id: 'avverbi', nome: 'Avverbi di Frequenza', icona: '⏰', colore: '#FDCB6E', descrizione: 'Sempre, mai, spesso, qualche volta…' },
  { id: 'passato-prossimo', nome: 'Passato Prossimo', icona: '⏪', colore: '#E17055', descrizione: 'Passato prossimo con essere e avere' },
  { id: 'preposizioni-tempo-luogo', nome: 'Prep. Tempo e Luogo', icona: '📍', colore: '#00CEC9', descrizione: 'Preposizioni di tempo e luogo' },
]

const grammarModules: Record<string, { data: { esercizi: { frase: string; emoji: string; [k: string]: string }[]; icona: string; nome: string; colore: string }; campo: string; etichetta: string }> = {
  verbi: { data: esercizioVerbi, campo: 'verbo', etichetta: 'Coniuga il verbo al presente' },
  aggettivi: { data: esercizioAggettivi, campo: 'aggettivo', etichetta: "Accorda l'aggettivo corretto" },
  pronomi: { data: esercizioPronomi, campo: 'pronome', etichetta: 'Scegli il pronome corretto' },
  possessivi: { data: esercizioPossessivi, campo: 'possessivo', etichetta: "Scegli l'aggettivo possessivo corretto" },
  avverbi: { data: esercizioAvverbi, campo: 'avverbio', etichetta: "Completa con l'avverbio di frequenza" },
  'passato-prossimo': { data: esercizioPassatoProssimo, campo: 'verbo', etichetta: 'Completa con il passato prossimo' },
  'preposizioni-tempo-luogo': { data: esercizioPreposizioniTempoLuogo, campo: 'preposizione', etichetta: 'Scegli la preposizione di tempo/luogo' },
  congiunzioni: { data: esercizioCongiunzioni, campo: 'congiunzione', etichetta: 'Completa la frase con la congiunzione giusta' },
  'preposizioni-semplici': { data: esercizioPreposizioniSemplici, campo: 'preposizione', etichetta: 'Completa la frase con la preposizione semplice giusta' },
}

type TemaId = 'giochi' | 'esercizi' | 'storie' | null

function App() {
  const [tema, setTema] = useState<TemaId>(null)
  const [categoria, setCategoria] = useState<CategoriaEsercizio | Storia | null>(null)
  const [stelle, setStelle] = useState(() => getChiaviGuadagnate().length)
  const [mostraModaleStelle, setMostraModaleStelle] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getUserProfile())

  useEffect(() => {
    setAudioEnabled(userProfile.disableAudio === false)
  }, [userProfile.disableAudio])

  function guadagnaStella(domandaKey: string) {
    if (registraStella(domandaKey)) {
      setStelle((s) => s + 1)
      playStarSound()
    }
  }

  const onBack = () => setCategoria(null)
  const onStarEarned = guadagnaStella
  const backToMenu = () => { setTema(null); setCategoria(null) }

  function handleSaveProfile(profile: UserProfile) {
    setUserProfile(profile)
    saveUserProfile(profile)
  }

  let content: React.ReactNode

  if (!tema) {
    content = <ThemeMenu onSelectTema={(id) => setTema(id as TemaId)} />
  } else if (!categoria) {
    if (tema === 'giochi') {
      const categorieGiochi: CategoriaEsercizio[] = [
        ...categorieVocabolario,
        { id: datiCalendario.id, nome: datiCalendario.nome, icona: datiCalendario.icona, colore: datiCalendario.colore, descrizione: datiCalendario.descrizione, livello: 2 },
        { id: datiOrologio.id, nome: datiOrologio.nome, icona: datiOrologio.icona, colore: datiOrologio.colore, descrizione: datiOrologio.descrizione, livello: 2 },
        { id: datiDita.id, nome: datiDita.nome, icona: datiDita.icona, colore: datiDita.colore, descrizione: datiDita.descrizione, livello: 2 },
      ]
      content = <Home categorie={categorieGiochi} onStart={(c) => setCategoria(c)} onBackToMenu={backToMenu} icona="📖" titolo="Vocabolario" sottotitolo="Scegli un argomento per imparare nuove parole" />
    } else if (tema === 'storie') {
      content = <Home categorie={storie as unknown as CategoriaEsercizio[]} onStart={(c) => setCategoria(c as unknown as Storia)} onBackToMenu={backToMenu} icona="📖" titolo="Storie" sottotitolo="Leggi e ascolta brevi storie in italiano" />
    } else if (tema === 'esercizi') {
      content = <Home categorie={categorieEsercizi} onStart={(c) => setCategoria(c)} onBackToMenu={backToMenu} icona="✍️" titolo="Grammatica" sottotitolo="Allenati con la grammatica" />
    } else {
      content = <Placeholder tema={tema} onBackToMenu={backToMenu} />
    }
  } else if (tema === 'giochi') {
    if (categoria.id === 'calendario') {
      content = <CalendarioGame onBack={onBack} onStarEarned={onStarEarned} />
    } else if (categoria.id === 'orologio') {
      content = <OrologioGame onBack={onBack} onStarEarned={onStarEarned} />
    } else if (categoria.id === 'dita') {
      content = <DitaGame onBack={onBack} onStarEarned={onStarEarned} />
    } else {
      content = <Game key={categoria.id} categoria={categoria as import('./types').CategoriaVocabolario} onBack={onBack} onStarEarned={onStarEarned} />
    }
  } else if (tema === 'storie') {
    content = <StoriaGame storia={categoria as unknown as Storia} onBack={onBack} onStarEarned={onStarEarned} />
  } else if (tema === 'esercizi') {
    const mod = grammarModules[categoria.id]
    if (mod) {
      content = (
        <GrammarGame
          key={categoria.id}
          esercizi={mod.data.esercizi}
          campo={mod.campo}
          etichetta={mod.etichetta}
          moduloId={categoria.id}
          icona={mod.data.icona}
          nome={mod.data.nome}
          colore={mod.data.colore}
          onBack={onBack}
          onStarEarned={onStarEarned}
        />
      )
    } else if (categoria.id === 'articoli') {
      content = <ArticoliGame onBack={onBack} onStarEarned={onStarEarned} />
    } else if (categoria.id === 'preposizioni') {
      content = <PreposizioniGame onBack={onBack} onStarEarned={onStarEarned} />
    }
  } else {
    content = <Placeholder tema={tema} onBackToMenu={backToMenu} />
  }

  return (
    <>
      <UserMenu profile={userProfile} onSave={handleSaveProfile} lowered={tema === 'giochi' && !!categoria} />
      {content}
      <StarsCounter count={stelle} onClick={() => setMostraModaleStelle(true)} />
      {mostraModaleStelle && (
        <StarsModal
          onClose={() => setMostraModaleStelle(false)}
          onReset={() => setStelle(getChiaviGuadagnate().length)}
        />
      )}
    </>
  )
}

export default App
