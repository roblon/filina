import { useState } from 'react'
import ThemeMenu from './components/ThemeMenu'
import Home from './components/Home'
import Game from './components/Game'
import Placeholder from './components/Placeholder'
import './App.css'

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

  return <Placeholder tema={tema} onBackToMenu={() => setTema(null)} />
}

export default App
