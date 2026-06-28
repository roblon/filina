function Riepilogo({ icona, nome, colore, punteggio, totale, risposte, onBack, grammatica }) {
  function TestoConErrore({ testo, errore }) {
    if (!errore) return testo
    const re = new RegExp(`(${errore.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = testo.split(re)
    return parts.map((part, i) =>
      part.toLowerCase() === errore.toLowerCase()
        ? <span key={i} className="errore-testo">{part}</span>
        : part
    )
  }
  return (
    <div className="risultati-screen">
      <div className="risultati-card" style={{ '--cat-color': colore }}>
        <span className="risultati-icona">{icona}</span>
        <h2>Complimenti!</h2>
        <p className="risultati-testo">
          Hai completato <strong>{nome}</strong>!
        </p>
        <div className="punteggio-finale">
          <span className="punteggio-numero">{punteggio}</span>
          <span className="punteggio-div">/</span>
          <span className="punteggio-totale">{totale}</span>
        </div>

        <div className="riepilogo-lista">
          {risposte.map((r, i) => (
            <div key={i} className={`riepilogo-riga ${r.corretta ? 'giusta' : 'sbagliata'}`}>
              <span className="riepilogo-icona">{r.corretta ? '✅' : '❌'}</span>
              {grammatica && (
                <span className="riepilogo-domanda">
                  {r.corretta ? r.rispostaCorretta : <TestoConErrore testo={r.rispostaData} errore={r.valoreSbagliato} />}
                </span>
              )}
              {!grammatica && (
                <>
                  <span className="riepilogo-domanda">{r.domanda}</span>
                  {!r.corretta && (
                    <span className="riepilogo-correzione">
                      {r.rispostaData} → {r.rispostaCorretta}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="risultati-azioni">
          <button className="btn btn-riprova" onClick={onBack}>
            🔙 Scegli un altro argomento
          </button>
        </div>
      </div>
    </div>
  )
}

export default Riepilogo
