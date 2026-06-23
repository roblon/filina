import { useState } from 'react'
import ThemeMenu from './components/ThemeMenu'
import Home from './components/Home'
import Game from './components/Game'
import ArticoliGame from './components/ArticoliGame'
import PreposizioniGame from './components/PreposizioniGame'
import PreposizioniSempliciGame from './components/PreposizioniSempliciGame'
import Placeholder from './components/Placeholder'
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
]

function App() {
  const [tema, setTema] = useState(null)
  const [categoria, setCategoria] = useState(null)

  if (!tema) {
    return <ThemeMenu onSelectTema={setTema} />
  }

  if (tema === 'giochi') {
    if (categoria) {
      return (
        <Game
          key={categoria.id}
          categoria={categoria}
          onBack={() => setCategoria(null)}
        />
      )
    }
    return <Home onStart={setCategoria} onBackToMenu={() => setTema(null)} />
  }

  if (tema === 'esercizi') {
    if (categoria) {
      if (categoria.id === 'articoli') {
        return <ArticoliGame key="articoli" onBack={() => setCategoria(null)} />
      }
      if (categoria.id === 'preposizioni') {
        return <PreposizioniGame key="preposizioni" onBack={() => setCategoria(null)} />
      }
      if (categoria.id === 'preposizioni-semplici') {
        return <PreposizioniSempliciGame key="preposizioni-semplici" onBack={() => setCategoria(null)} />
      }
    }
    return (
      <Home
        categorie={categorieEsercizi}
        onStart={setCategoria}
        onBackToMenu={() => setTema(null)}
        icona="✍️"
        titolo="Grammatica"
        sottotitolo="Allenati con la grammatica"
      />
    )
  }

  return <Placeholder tema={tema} onBackToMenu={() => setTema(null)} />
}

export default App
