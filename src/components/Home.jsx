function Home({ onStart, onBackToMenu, categorie: categorieProp, icona, titolo, sottotitolo }) {
  const categorie = categorieProp || []
  const hasLevels = categorie.some((c) => c.livello != null)

  function renderGriglia(items) {
    return (
      <div className="categorie-grid">
        {items.map((cat) => (
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
    )
  }

  if (hasLevels) {
    const livelli = []
    for (const c of categorie) {
      const lv = c.livello || 1
      let gruppo = livelli.find((g) => g.lv === lv)
      if (!gruppo) {
        gruppo = { lv, categorie: [] }
        livelli.push(gruppo)
      }
      gruppo.categorie.push(c)
    }

    return (
      <div className="home">
        <div className="home-header">
          <button className="btn-back menu-btn" onClick={onBackToMenu}>
            ← Menu
          </button>
          <span className="home-icon">{icona || '🎮'}</span>
          <h1>{titolo || 'Filina - Impara L\'Italiano'}</h1>
          <p>{sottotitolo || 'Scegli un argomento per iniziare a giocare'}</p>
        </div>
        {livelli.map((g, i) => (
          <div key={g.lv} className="home-level-group">
            {i > 0 && <div className="home-level-divider" />}
            <div className="home-level-label">Livello {g.lv}</div>
            {renderGriglia(g.categorie)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="home">
      <div className="home-header">
        <button className="btn-back menu-btn" onClick={onBackToMenu}>
          ← Menu
        </button>
        <span className="home-icon">{icona || '🎮'}</span>
        <h1>{titolo || 'Filina - Impara L\'Italiano'}</h1>
        <p>{sottotitolo || 'Scegli un argomento per iniziare a giocare'}</p>
      </div>
      {renderGriglia(categorie)}
    </div>
  )
}

export default Home
