import { inizializzaTTS } from '../utils/tts'

const temi = [
  { id: 'giochi', nome: 'Giochi', descrizione: 'Impara il vocabolario con quiz interattivi', icona: '🎮', colore: '#FF6B6B' },
  { id: 'esercizi', nome: 'Grammatica', descrizione: 'Allenati con la grammatica', icona: '✍️', colore: '#4ECDC4' },
  { id: 'storie', nome: 'Storie', descrizione: 'Leggi e ascolta brevi storie in italiano', icona: '📖', colore: '#A66CFF' },
]

function ThemeMenu({ onSelectTema }) {
  return (
    <div className="menu">
      <div className="menu-header">
        <span className="menu-logo">🎮</span>
        <h1>Filina</h1>
        <p className="menu-subtitle">Impara l'Italiano</p>
      </div>
      <div className="menu-grid">
        {temi.map((tema) => (
          <button
            key={tema.id}
            className="menu-card"
            style={{ '--tema-color': tema.colore }}
            onClick={() => { inizializzaTTS(); onSelectTema(tema.id) }}
          >
            <span className="menu-card-icona">{tema.icona}</span>
            <span className="menu-card-nome">{tema.nome}</span>
            <span className="menu-card-desc">{tema.descrizione}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ThemeMenu
