import { useState } from 'react'
import ThemeMenu from './components/ThemeMenu'
import Home from './components/Home'
import Game from './components/Game'
import ArticoliGame from './components/ArticoliGame'
import PreposizioniGame from './components/PreposizioniGame'
import PreposizioniSempliciGame from './components/PreposizioniSempliciGame'
import CongiunzioniGame from './components/CongiunzioniGame'
import Placeholder from './components/Placeholder'
import StarsCounter from './components/StarsCounter'
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
