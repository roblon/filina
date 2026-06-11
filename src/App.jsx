import { useState } from 'react'
import ThemeMenu from './components/ThemeMenu'
import Home from './components/Home'
import Game from './components/Game'
import ArticoliGame from './components/ArticoliGame'
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
    }
    return (
      <Home
        categorie={categorieEsercizi}
        onStart={setCategoria}
        onBackToMenu={() => setTema(null)}
        icona="✍️"
        titolo="Esercizi"
        sottotitolo="Allenati con esercizi di grammatica"
      />
    )
  }

  return <Placeholder tema={tema} onBackToMenu={() => setTema(null)} />
}

export default App
