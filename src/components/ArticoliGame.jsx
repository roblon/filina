import { useState, useEffect, useRef } from 'react'
import esercizioArticoli from '../data/articoli'
import { parla } from '../utils/tts'

function mischia(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const ARTICOLI_DETERMINATIVI = ['il', 'lo', "l'", 'la']
const ARTICOLI_INDETERMINATIVI = ['un', 'uno', "un'", 'una']

function generaOpzioni(parola, tipo) {
  const pool = tipo === 'determinativo' ? ARTICOLI_DETERMINATIVI : ARTICOLI_INDETERMINATIVI
  const corretto = tipo === 'determinativo' ? parola.determinativo : parola.indeterminativo
  const altri = pool.filter(a => a !== corretto)
  const distrattori = mischia(altri).slice(0, 3)
  return mischia([corretto, ...distrattori])
}

function articoloCompleto(parola, tipo) {
  const art = tipo === 'determinativo' ? parola.determinativo : parola.indeterminativo
  return art.endsWith("'") ? `${art}${parola.parola}` : `${art} ${parola.parola}`
}

function ArticoliGame({ onBack }) {
  const [parole] = useState(() => mischia(esercizioArticoli.parole))

  const [indice, setIndice] = useState(0)
  const [punteggio, setPunteggio] = useState(0)
  const [risposto, setRisposto] = useState(false)
  const [fatto, setFatto] = useState(false)
  const [ultimaRisposta, setUltimaRisposta] = useState(null)
  const [tipo, setTipo] = useState(() => Math.random() < 0.5 ? 'determinativo' : 'indeterminativo')
  const [opzioni, setOpzioni] = useState(() => {
    const t = Math.random() < 0.5 ? 'determinativo' : 'indeterminativo'
    return generaOpzioni(parole[0], t)
  })

  const parolaCorrente = parole[indice]
  const ultimoIndiceParlato = useRef(-1)

  useEffect(() => {
    if (parolaCorrente && ultimoIndiceParlato.current !== indice) {
      parla(articoloCompleto(parolaCorrente, tipo))
      ultimoIndiceParlato.current = indice
    }
  }, [indice, parolaCorrente, tipo])

  function gestisciRisposta(articoloScelto) {
    if (risposto) return
    setRisposto(true)
    setUltimaRisposta(articoloScelto)
    const corretto = tipo === 'determinativo' ? parolaCorrente.determinativo : parolaCorrente.indeterminativo
    if (articoloScelto === corretto) {
      setPunteggio((p) => p + 1)
    }
  }

  function prossimaDomanda() {
    if (indice + 1 >= parole.length) {
      setFatto(true)
      return
    }
    const nuovoIndice = indice + 1
    const nuovoTipo = Math.random() < 0.5 ? 'determinativo' : 'indeterminativo'
    setIndice(nuovoIndice)
    setTipo(nuovoTipo)
    setRisposto(false)
    setUltimaRisposta(null)
    setOpzioni(generaOpzioni(parole[nuovoIndice], nuovoTipo))
  }

  if (!parolaCorrente) return null

  if (fatto) {
    return (
      <div className="risultati-screen">
        <div className="risultati-card" style={{ '--cat-color': esercizioArticoli.colore }}>
          <span className="risultati-icona">{esercizioArticoli.icona}</span>
          <h2>Complimenti!</h2>
          <p className="risultati-testo">
            Hai completato <strong>{esercizioArticoli.nome}</strong>!
          </p>
          <div className="punteggio-finale">
            <span className="punteggio-numero">{punteggio}</span>
            <span className="punteggio-div">/</span>
            <span className="punteggio-totale">{parole.length}</span>
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

  const corretto = tipo === 'determinativo' ? parolaCorrente.determinativo : parolaCorrente.indeterminativo
  const tipoLabel = tipo === 'determinativo' ? 'DETERMINATIVO' : 'INDETERMINATIVO'

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
              width: `${(indice / parole.length) * 100}%`,
              background: esercizioArticoli.colore,
            }}
          />
        </div>
        <span className="punteggio-corrente">
          {esercizioArticoli.icona} {punteggio}/{indice + (risposto ? 1 : 0)}
        </span>
      </div>

      <div className="game-area">
        <div className={`tipo-badge ${tipo}`}>{tipoLabel}</div>

        <div className="domanda-label">Scegli l&apos;articolo {tipo} per...</div>

        <div className="parola-corrente">
          <span className="articolo-parola-emoji">{parolaCorrente.emoji}</span>
          <span className="articolo-parola-testo">{parolaCorrente.parola}</span>
          <button
            className="btn-speak"
            onClick={() => parla(parolaCorrente.parola)}
            aria-label="Ascolta la parola"
          >
            🔈
          </button>
        </div>

        <div className="opzioni-grid articoli">
          {opzioni.map((art, i) => (
            <button
              key={art + i}
              className={`opzione-btn articolo-btn ${
                risposto
                  ? art === corretto
                    ? 'corretta'
                    : art === ultimaRisposta
                      ? 'sbagliata'
                      : ''
                  : ''
              }`}
              onClick={() => gestisciRisposta(art)}
              disabled={risposto}
            >
              <span className="opzione-articolo">{art}</span>
            </button>
          ))}
        </div>

        {risposto && (
          <div className="feedback">
            {ultimaRisposta === corretto ? (
              <div className="feedback-corretto">
                <span>✅</span> Bravo! {articoloCompleto(parolaCorrente, tipo)}!
              </div>
            ) : (
              <div className="feedback-sbagliato">
                <span>❌</span> L&apos;articolo {tipo} giusto è &quot;{corretto}&quot; → {articoloCompleto(parolaCorrente, tipo)}
              </div>
            )}
            <button
              className="btn-next"
              style={{ background: esercizioArticoli.colore }}
              onClick={prossimaDomanda}
            >
              {indice + 1 >= parole.length ? 'Vedi risultati →' : 'Prossima →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticoliGame
