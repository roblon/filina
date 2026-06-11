const info = {
  storie: { icona: '📖', titolo: 'Storie', testo: 'Presto disponibile! Brevi storie in italiano per migliorare la lettura e la comprensione.' },
}

function Placeholder({ tema, onBackToMenu }) {
  const dati = info[tema] || {}
  return (
    <div className="placeholder-screen">
      <div className="placeholder-card">
        <span className="placeholder-icona">{dati.icona}</span>
        <h2>{dati.titolo}</h2>
        <p>{dati.testo}</p>
        <button className="btn btn-riprova" onClick={onBackToMenu}>
          🔙 Torna al menu
        </button>
      </div>
    </div>
  )
}

export default Placeholder
