import categorie from '../data/vocabolario'

function Home({ onStart, onBackToMenu }) {
  return (
    <div className="home">
      <div className="home-header">
        <button className="btn-back menu-btn" onClick={onBackToMenu}>
          ← Menu
        </button>
        <span className="home-icon">🎮</span>
        <h1>Filina - Impara L'Italiano</h1>
        <p>Scegli un argomento per iniziare a giocare</p>
      </div>
      <div className="categorie-grid">
        {categorie.map((cat) => (
          <button
            key={cat.id}
            className="categoria-card"
            style={{ '--cat-color': cat.colore }}
            onClick={() => onStart(cat)}
          >
            <span className="categoria-icona">{cat.icona}</span>
            <span className="categoria-nome">{cat.nome}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Home
