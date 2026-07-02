import { useState } from 'react'
import ThemeMenu from './components/ThemeMenu'
import Home from './components/Home'
import Game from './components/Game'
import ArticoliGame from './components/ArticoliGame'
import PreposizioniGame from './components/PreposizioniGame'
import PreposizioniSempliciGame from './components/PreposizioniSempliciGame'
import CongiunzioniGame from './components/CongiunzioniGame'
import GrammarGame from './components/GrammarGame'
import StoriaGame from './components/StoriaGame'
import Placeholder from './components/Placeholder'
import StarsCounter from './components/StarsCounter'
import storie from './data/storie'
import esercizioVerbi from './data/verbi'
import esercizioAggettivi from './data/aggettivi'
import esercizioPronomi from './data/pronomi'
import esercizioPossessivi from './data/possessivi'
import esercizioAvverbi from './data/avverbi'
import esercizioPassatoProssimo from './data/passato-prossimo'
import esercizioPreposizioniTempoLuogo from './data/preposizioni-tempo-luogo'
import StarsModal from './components/StarsModal'
import { getChiaviGuadagnate, registraStella } from './utils/stelle'
import { playStarSound } from './utils/tts'
import './App.css'

const categorieEsercizi = [
  {
    id: 'articoli',
    nome: 'Articoli',
    icona: '📝',
    colore: '#4ECDC4',
    descrizione: 'Impara gli articoli determinativi e indeterminativi',
  },
  {
    id: 'preposizioni-semplici',
    nome: 'Preposizioni Semplici',
    icona: '➡️',
    colore: '#6C5CE7',
    descrizione: 'Impara le preposizioni semplici (di, a, da, in, con, su, per, tra, fra)',
  },
  {
    id: 'preposizioni',
    nome: 'Preposizioni Articolate',
    icona: '🔗',
    colore: '#FF8C42',
    descrizione: 'Impara le preposizioni articolate (al, del, nel, dal, sul…)',
  },
  {
    id: 'congiunzioni',
    nome: 'Congiunzioni',
    icona: '🔀',
    colore: '#E17055',
    descrizione: 'Impara le congiunzioni (e, ma, perché, se, mentre, però, che…)',
  },
  {
    id: 'verbi',
    nome: 'Verbi al Presente',
    icona: '🏃',
    colore: '#00B894',
    descrizione: 'Coniuga i verbi al presente (-are, -ere, -ire)',
  },
  {
    id: 'aggettivi',
    nome: 'Aggettivi',
    icona: '🎨',
    colore: '#FD79A8',
    descrizione: 'Accorda gli aggettivi con nome e genere',
  },
  {
    id: 'pronomi',
    nome: 'Pronomi',
    icona: '🔄',
    colore: '#0984E3',
    descrizione: 'Pronomi diretti e indiretti (mi, ti, lo, la, gli, le…)',
  },
  {
    id: 'possessivi',
    nome: 'Possessivi',
    icona: '👤',
    colore: '#6C5CE7',
    descrizione: 'Aggettivi possessivi (mio, tuo, suo, nostro, vostro)',
  },
  {
    id: 'avverbi',
    nome: 'Avverbi di Frequenza',
    icona: '⏰',
    colore: '#FDCB6E',
    descrizione: 'Sempre, mai, spesso, qualche volta…',
  },
  {
    id: 'passato-prossimo',
    nome: 'Passato Prossimo',
    icona: '⏪',
    colore: '#E17055',
    descrizione: 'Passato prossimo con essere e avere',
  },
  {
    id: 'preposizioni-tempo-luogo',
    nome: 'Prep. Tempo e Luogo',
    icona: '📍',
    colore: '#00CEC9',
    descrizione: 'Preposizioni di tempo e luogo',
  },
]

function App() {
  const [tema, setTema] = useState(null)
  const [categoria, setCategoria] = useState(null)
  const [stelle, setStelle] = useState(() => getChiaviGuadagnate().length)
  const [mostraModaleStelle, setMostraModaleStelle] = useState(false)

  function guadagnaStella(domandaKey) {
    if (registraStella(domandaKey)) {
      setStelle((s) => s + 1)
      playStarSound()
    }
  }

  if (!tema) {
    return (
      <>
        <ThemeMenu onSelectTema={setTema} />
        <StarsCounter count={stelle} onClick={() => setMostraModaleStelle(true)} />
      {mostraModaleStelle && <StarsModal onClose={() => setMostraModaleStelle(false)} onReset={() => setStelle(getChiaviGuadagnate().length)} />}
      </>
    )
  }

  if (tema === 'giochi') {
    if (categoria) {
      return (
        <>
          <Game
            key={categoria.id}
            categoria={categoria}
            onBack={() => setCategoria(null)}
            onStarEarned={guadagnaStella}
          />
          <StarsCounter count={stelle} onClick={() => setMostraModaleStelle(true)} />
      {mostraModaleStelle && <StarsModal onClose={() => setMostraModaleStelle(false)} onReset={() => setStelle(getChiaviGuadagnate().length)} />}
        </>
      )
    }
    return (
      <>
        <Home
          onStart={setCategoria}
          onBackToMenu={() => setTema(null)}
          icona="📖"
          titolo="Vocabolario"
          sottotitolo="Scegli un argomento per imparare nuove parole"
        />
        <StarsCounter count={stelle} onClick={() => setMostraModaleStelle(true)} />
      {mostraModaleStelle && <StarsModal onClose={() => setMostraModaleStelle(false)} onReset={() => setStelle(getChiaviGuadagnate().length)} />}
      </>
    )
  }

  if (tema === 'storie') {
    if (categoria) {
      return (
        <>
          <StoriaGame
            storia={categoria}
            onBack={() => setCategoria(null)}
            onStarEarned={guadagnaStella}
          />
          <StarsCounter count={stelle} onClick={() => setMostraModaleStelle(true)} />
          {mostraModaleStelle && <StarsModal onClose={() => setMostraModaleStelle(false)} onReset={() => setStelle(getChiaviGuadagnate().length)} />}
        </>
      )
    }
    return (
      <>
        <Home
          categorie={storie}
          onStart={setCategoria}
          onBackToMenu={() => setTema(null)}
          icona="📖"
          titolo="Storie"
          sottotitolo="Leggi e ascolta brevi storie in italiano"
        />
        <StarsCounter count={stelle} onClick={() => setMostraModaleStelle(true)} />
        {mostraModaleStelle && <StarsModal onClose={() => setMostraModaleStelle(false)} onReset={() => setStelle(getChiaviGuadagnate().length)} />}
      </>
    )
  }

  if (tema === 'esercizi') {
    if (categoria) {
      return (
        <>
          {categoria.id === 'articoli' && (
            <ArticoliGame key="articoli" onBack={() => setCategoria(null)} onStarEarned={guadagnaStella} />
          )}
          {categoria.id === 'preposizioni' && (
            <PreposizioniGame key="preposizioni" onBack={() => setCategoria(null)} onStarEarned={guadagnaStella} />
          )}
          {categoria.id === 'preposizioni-semplici' && (
            <PreposizioniSempliciGame key="preposizioni-semplici" onBack={() => setCategoria(null)} onStarEarned={guadagnaStella} />
          )}
          {categoria.id === 'congiunzioni' && (
            <CongiunzioniGame key="congiunzioni" onBack={() => setCategoria(null)} onStarEarned={guadagnaStella} />
          )}
          {categoria.id === 'verbi' && (
            <GrammarGame key="verbi" esercizi={esercizioVerbi.esercizi} campo="verbo" etichetta="Coniuga il verbo al presente" moduloId="verbi" icona={esercizioVerbi.icona} nome={esercizioVerbi.nome} colore={esercizioVerbi.colore} onBack={() => setCategoria(null)} onStarEarned={guadagnaStella} />
          )}
          {categoria.id === 'aggettivi' && (
            <GrammarGame key="aggettivi" esercizi={esercizioAggettivi.esercizi} campo="aggettivo" etichetta="Accorda l'aggettivo corretto" moduloId="aggettivi" icona={esercizioAggettivi.icona} nome={esercizioAggettivi.nome} colore={esercizioAggettivi.colore} onBack={() => setCategoria(null)} onStarEarned={guadagnaStella} />
          )}
          {categoria.id === 'pronomi' && (
            <GrammarGame key="pronomi" esercizi={esercizioPronomi.esercizi} campo="pronome" etichetta="Scegli il pronome corretto" moduloId="pronomi" icona={esercizioPronomi.icona} nome={esercizioPronomi.nome} colore={esercizioPronomi.colore} onBack={() => setCategoria(null)} onStarEarned={guadagnaStella} />
          )}
          {categoria.id === 'possessivi' && (
            <GrammarGame key="possessivi" esercizi={esercizioPossessivi.esercizi} campo="possessivo" etichetta="Scegli l'aggettivo possessivo corretto" moduloId="possessivi" icona={esercizioPossessivi.icona} nome={esercizioPossessivi.nome} colore={esercizioPossessivi.colore} onBack={() => setCategoria(null)} onStarEarned={guadagnaStella} />
          )}
          {categoria.id === 'avverbi' && (
            <GrammarGame key="avverbi" esercizi={esercizioAvverbi.esercizi} campo="avverbio" etichetta="Completa con l'avverbio di frequenza" moduloId="avverbi" icona={esercizioAvverbi.icona} nome={esercizioAvverbi.nome} colore={esercizioAvverbi.colore} onBack={() => setCategoria(null)} onStarEarned={guadagnaStella} />
          )}
          {categoria.id === 'passato-prossimo' && (
            <GrammarGame key="passato-prossimo" esercizi={esercizioPassatoProssimo.esercizi} campo="verbo" etichetta="Completa con il passato prossimo" moduloId="passato-prossimo" icona={esercizioPassatoProssimo.icona} nome={esercizioPassatoProssimo.nome} colore={esercizioPassatoProssimo.colore} onBack={() => setCategoria(null)} onStarEarned={guadagnaStella} />
          )}
          {categoria.id === 'preposizioni-tempo-luogo' && (
            <GrammarGame key="preposizioni-tempo-luogo" esercizi={esercizioPreposizioniTempoLuogo.esercizi} campo="preposizione" etichetta="Scegli la preposizione di tempo/luogo" moduloId="preposizioni-tempo-luogo" icona={esercizioPreposizioniTempoLuogo.icona} nome={esercizioPreposizioniTempoLuogo.nome} colore={esercizioPreposizioniTempoLuogo.colore} onBack={() => setCategoria(null)} onStarEarned={guadagnaStella} />
          )}
          <StarsCounter count={stelle} onClick={() => setMostraModaleStelle(true)} />
      {mostraModaleStelle && <StarsModal onClose={() => setMostraModaleStelle(false)} onReset={() => setStelle(getChiaviGuadagnate().length)} />}
        </>
      )
    }
    return (
      <>
        <Home
          categorie={categorieEsercizi}
          onStart={setCategoria}
          onBackToMenu={() => setTema(null)}
          icona="✍️"
          titolo="Grammatica"
          sottotitolo="Allenati con la grammatica"
        />
        <StarsCounter count={stelle} onClick={() => setMostraModaleStelle(true)} />
      {mostraModaleStelle && <StarsModal onClose={() => setMostraModaleStelle(false)} onReset={() => setStelle(getChiaviGuadagnate().length)} />}
      </>
    )
  }

  return (
    <>
      <Placeholder tema={tema} onBackToMenu={() => setTema(null)} />
      <StarsCounter count={stelle} onClick={() => setMostraModaleStelle(true)} />
      {mostraModaleStelle && <StarsModal onClose={() => setMostraModaleStelle(false)} onReset={() => setStelle(getChiaviGuadagnate().length)} />}
    </>
  )
}

export default App
