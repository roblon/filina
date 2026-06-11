import { useState } from 'react'
import Home from './components/Home'
import Game from './components/Game'
import './App.css'

function App() {
  const [categoria, setCategoria] = useState(null)

  if (categoria) {
    return (
      <Game
        key={categoria.id}
        categoria={categoria}
        onBack={() => setCategoria(null)}
      />
    )
  }

  return <Home onStart={setCategoria} />
}

export default App
