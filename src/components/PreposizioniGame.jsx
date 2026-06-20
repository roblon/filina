import { useState, useEffect, useRef } from 'react'
import esercizioPreposizioni from '../data/preposizioni'
import { playMp3, stopAudio } from '../utils/tts'

function mischia(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const MAP = {
  'a+il': 'al',
  'a+lo': 'allo',
  "a+l'": "all'",
  'a+la': 'alla',
  'di+il': 'del',
  'di+lo': 'dello',
  "di+l'": "dell'",
  'di+la': 'della',
  'da+il': 'dal',
  'da+lo': 'dallo',
  "da+l'": "dall'",
  'da+la': 'dalla',
  'in+il': 'nel',
  'in+lo': 'nello',
  "in+l'": "nell'",
  'in+la': 'nella',
  'su+il': 'sul',
  'su+lo': 'sullo',
  "su+l'": "sull'",
  'su+la': 'sulla',
}

const TUTTE_FORME = [
  'al', 'allo', "all'", 'alla',
  'del', 'dello', "dell'", 'della',
  'dal', 'dallo', "dall'", 'dalla',
  'nel', 'nello', "nell'", 'nella',
  'sul', 'sullo', "sull'", 'sulla',
]

function generaOpzioni(corretta) {
  const altre = TUTTE_FORME.filter(a => a !== corretta)
  const distrattori = mischia(altre).slice(0, 3)
  return mischia([corretta, ...distrattori])
}

function riempiFrase(frase, articolata) {
  return frase.replace('___', articolata)
}

function PreposizioniGame({ onBack }) {
  const [esercizi] = useState(() => {
    const conIndice = esercizioPreposizioni.esercizi.map((e, i) => ({ ...e, indiceOriginale: i }))
    return mischia(conIndice)
  })

  const [indice, setIndice] = useState(0)
  const [punteggio, setPunteggio] = useState(0)
  const [risposto, setRisposto] = useState(false)
  const [fatto, setFatto] = useState(false)
  const [ultimaRisposta, setUltimaRisposta] = useState(null)
  const [opzioni, setOpzioni] = useState(() => {
    const e = esercizi[0]
    return generaOpzioni(MAP[`${e.preposizione}+${e.articolo}`])
  })

  const esercizioCorrente = esercizi[indice]
  const ultimoIndiceParlato = useRef(-1)
  const corretta = MAP[`${esercizioCorrente.preposizione}+${esercizioCorrente.articolo}`]
  const parti = esercizioCorrente.frase.split('___')

  useEffect(() => {
    if (esercizioCorrente && ultimoIndiceParlato.current !== indice) {
      const path = `${import.meta.env.BASE_URL}assets/audio/preposizione-${String(esercizioCorrente.indiceOriginale + 1).padStart(2, '0')}.mp3`
      playMp3(path)
      ultimoIndiceParlato.current = indice
    }
  }, [indice, esercizioCorrente, corretta])

  useEffect(() => {
    return () => stopAudio()
  }, [])

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
    setOpzioni(generaOpzioni(MAP[`${esercizi[nuovoIndice].preposizione}+${esercizi[nuovoIndice].articolo}`]))
  }

  if (!esercizioCorrente) return null

  if (fatto) {
    return (
      <div className="risultati-screen">
        <div className="risultati-card" style={{ '--cat-color': esercizioPreposizioni.colore }}>
          <span className="risultati-icona">{esercizioPreposizioni.icona}</span>
          <h2>Complimenti!</h2>
          <p className="risultati-testo">
            Hai completato <strong>{esercizioPreposizioni.nome}</strong>!
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
              background: esercizioPreposizioni.colore,
            }}
          />
        </div>
        <span className="punteggio-corrente">
          {esercizioPreposizioni.icona} {punteggio}/{indice + (risposto ? 1 : 0)}
        </span>
      </div>

      <div className="game-area">
        <span className="articolo-parola-emoji">
          {esercizioCorrente.emoji}
          <button
            className="btn-speak"
            onClick={() => {
              const path = `${import.meta.env.BASE_URL}assets/audio/preposizione-${String(esercizioCorrente.indiceOriginale + 1).padStart(2, '0')}.mp3`
              playMp3(path)
            }}
            aria-label="Ascolta la parola"
          >
            🔈
          </button>
        </span>

        <div className="domanda-label">Completa la frase con la preposizione articolata giusta</div>

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
          {opzioni.map((art, i) => (
            <button
              key={art + i}
              className={`opzione-btn articolo-btn ${
                risposto
                  ? art === corretta
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
              style={{ background: esercizioPreposizioni.colore }}
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

export default PreposizioniGame
