function Riepilogo({ icona, nome, colore, punteggio, totale, risposte, onBack }) {
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
              <span className="riepilogo-domanda">{r.domanda}</span>
              {!r.corretta && r.rispostaCorretta && (
                <span className="riepilogo-correzione">{r.rispostaCorretta}</span>
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
