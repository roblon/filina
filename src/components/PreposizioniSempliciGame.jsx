import { useState, useEffect, useRef } from 'react'
import esercizioPreposizioniSemplici from '../data/preposizioni-semplici'
import { parla } from '../utils/tts'

function mischia(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TUTTE_PREPOSIZIONI = ['di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra']

function generaOpzioni(corretta) {
  const altre = TUTTE_PREPOSIZIONI.filter(p => p !== corretta)
  const distrattori = mischia(altre).slice(0, 3)
  return mischia([corretta, ...distrattori])
}

function riempiFrase(frase, preposizione) {
  return frase.replace('___', preposizione)
}

function PreposizioniSempliciGame({ onBack }) {
  const [esercizi] = useState(() => mischia(esercizioPreposizioniSemplici.esercizi))

  const [indice, setIndice] = useState(0)
  const [punteggio, setPunteggio] = useState(0)
  const [risposto, setRisposto] = useState(false)
  const [fatto, setFatto] = useState(false)
  const [ultimaRisposta, setUltimaRisposta] = useState(null)
  const [opzioni, setOpzioni] = useState(() => generaOpzioni(esercizi[0].preposizione))

  const esercizioCorrente = esercizi[indice]
  const ultimoIndiceParlato = useRef(-1)
  const corretta = esercizioCorrente.preposizione
  const parti = esercizioCorrente.frase.split('___')

  useEffect(() => {
    if (esercizioCorrente && ultimoIndiceParlato.current !== indice) {
      parla(riempiFrase(esercizioCorrente.frase, corretta))
      ultimoIndiceParlato.current = indice
    }
  }, [indice, esercizioCorrente, corretta])

  function gestisciRisposta(scelta) {
    if (risposto) return
    setRisposto(true)
    setUltimaRisposta(scelta)
    if (scelta === corretta) {
      setPunteggio((p) => p + 1)
    }
  }

  function prossimaDomanda() {
    if (indice + 1 >= esercizi.length) {
      setFatto(true)
      return
    }
    const nuovoIndice = indice + 1
    setIndice(nuovoIndice)
    setRisposto(false)
    setUltimaRisposta(null)
    setOpzioni(generaOpzioni(esercizi[nuovoIndice].preposizione))
  }

  if (!esercizioCorrente) return null

  if (fatto) {
    return (
      <div className="risultati-screen">
        <div className="risultati-card" style={{ '--cat-color': esercizioPreposizioniSemplici.colore }}>
          <span className="risultati-icona">{esercizioPreposizioniSemplici.icona}</span>
          <h2>Complimenti!</h2>
          <p className="risultati-testo">
            Hai completato <strong>{esercizioPreposizioniSemplici.nome}</strong>!
          </p>
          <div className="punteggio-finale">
            <span className="punteggio-numero">{punteggio}</span>
            <span className="punteggio-div">/</span>
            <span className="punteggio-totale">{esercizi.length}</span>
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

  return (
    <div className="game">
      <div className="game-header">
        <button className="btn-back" onClick={onBack}>
          ← Indietro
        </button>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(indice / esercizi.length) * 100}%`,
              background: esercizioPreposizioniSemplici.colore,
            }}
          />
        </div>
        <span className="punteggio-corrente">
          {esercizioPreposizioniSemplici.icona} {punteggio}/{indice + (risposto ? 1 : 0)}
        </span>
      </div>

      <div className="game-area">
        <span className="articolo-parola-emoji">
          {esercizioCorrente.emoji}
          <button
            className="btn-speak"
            onClick={() => parla(riempiFrase(esercizioCorrente.frase, corretta))}
            aria-label="Ascolta la frase"
          >
            🔈
          </button>
        </span>

        <div className="domanda-label">Completa la frase con la preposizione semplice giusta</div>

        <div className="frase-esercizio">
          {parti.map((parte, i) => (
            <span key={i}>
              {parte}
              {i < parti.length - 1 && (
                risposto
                  ? <span className="blank filled">{corretta}</span>
                  : <span className="blank">___</span>
              )}
            </span>
          ))}
        </div>

        <div className="opzioni-grid articoli">
          {opzioni.map((prep, i) => (
            <button
              key={prep + i}
              className={`opzione-btn articolo-btn ${
                risposto
                  ? prep === corretta
                    ? 'corretta'
                    : prep === ultimaRisposta
                      ? 'sbagliata'
                      : ''
                  : ''
              }`}
              onClick={() => gestisciRisposta(prep)}
              disabled={risposto}
            >
              <span className="opzione-articolo">{prep}</span>
            </button>
          ))}
        </div>

        {risposto && (
          <div className="feedback">
            {ultimaRisposta === corretta ? (
              <div className="feedback-corretto">
                <span>✅</span> Bravo! {riempiFrase(esercizioCorrente.frase, corretta)}
              </div>
            ) : (
              <div className="feedback-sbagliato">
                <span>❌</span> Quasi! La risposta giusta è &quot;{corretta}&quot;: {riempiFrase(esercizioCorrente.frase, corretta)}
              </div>
            )}
            <button
              className="btn-next"
              style={{ background: esercizioPreposizioniSemplici.colore }}
              onClick={prossimaDomanda}
            >
              {indice + 1 >= esercizi.length ? 'Vedi risultati →' : 'Prossima →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PreposizioniSempliciGame
