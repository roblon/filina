import { useState, useEffect, useRef } from 'react'
import { playMp3, stopAudio } from '../utils/tts'
import { stellaGiaGuadagnata } from '../utils/stelle'
import Riepilogo from './Riepilogo'

function mischia(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generaOpzioni(corretta, pool) {
  const altre = pool.filter(p => p !== corretta)
  const distrattori = mischia(altre).slice(0, 3)
  return mischia([corretta, ...distrattori])
}

function GrammarGame({ esercizi: data, campo, etichetta, moduloId, icona, nome, colore, onBack, onStarEarned }) {
  const pool = [...new Set(data.map(e => e[campo]))]

  const [esercizi] = useState(() => {
    const conIndice = data.map((e, i) => ({ ...e, indiceOriginale: i }))
    return mischia(conIndice)
  })

  const [indice, setIndice] = useState(0)
  const [punteggio, setPunteggio] = useState(0)
  const [risposto, setRisposto] = useState(false)
  const [fatto, setFatto] = useState(false)
  const [ultimaRisposta, setUltimaRisposta] = useState(null)
  const [opzioni, setOpzioni] = useState(() => generaOpzioni(esercizi[0][campo], pool))
  const [risposte, setRisposte] = useState([])

  const esercizioCorrente = esercizi[indice]
  const ultimoIndiceParlato = useRef(-1)
  const corretta = esercizioCorrente[campo]
  const parti = esercizioCorrente.frase.split('___')
  const audioPath = `${import.meta.env.BASE_URL}assets/audio/esercizi/${moduloId}/${String(esercizioCorrente.indiceOriginale + 1).padStart(2, '0')}.mp3`

  useEffect(() => {
    if (esercizioCorrente && ultimoIndiceParlato.current !== indice) {
      playMp3(audioPath)
      ultimoIndiceParlato.current = indice
    }
  }, [indice, esercizioCorrente, audioPath])

  useEffect(() => {
    return () => stopAudio()
  }, [])

  function gestisciRisposta(scelta) {
    if (risposto) return
    setRisposto(true)
    setUltimaRisposta(scelta)
    const giusta = scelta === corretta
    if (giusta) {
      setPunteggio((p) => p + 1)
      onStarEarned?.(`esercizi/${moduloId}/${esercizioCorrente.indiceOriginale}`)
    }
    setRisposte(prev => [...prev, {
      domanda: `${esercizioCorrente.emoji} ${riempiFrase(esercizioCorrente.frase, '___')}`,
      corretta: giusta,
      rispostaCorretta: riempiFrase(esercizioCorrente.frase, corretta),
      rispostaData: riempiFrase(esercizioCorrente.frase, scelta),
      valoreSbagliato: giusta ? null : scelta,
    }])
    setTimeout(prossimaDomanda, 700)
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
    setOpzioni(generaOpzioni(esercizi[nuovoIndice][campo], pool))
  }

  if (!esercizioCorrente) return null

  if (fatto) {
    return (
      <Riepilogo
        icona={icona}
        nome={nome}
        colore={colore}
        punteggio={punteggio}
        totale={esercizi.length}
        risposte={risposte}
        onBack={onBack}
        grammatica
      />
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
              background: colore,
            }}
          />
        </div>
        <span className="punteggio-corrente">
          {icona} {punteggio}/{indice + (risposto ? 1 : 0)}
        </span>
      </div>

      <div className="game-area">
        <span className="articolo-parola-emoji">
          {esercizioCorrente.emoji}
          <button
            className="btn-speak"
            onClick={() => playMp3(audioPath)}
            aria-label="Ascolta la frase"
          >
            🔈
          </button>
        </span>

        <div className="domanda-label">{etichetta}</div>

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
          {opzioni.map((opt, i) => (
            <button
              key={opt + i}
              className={`opzione-btn articolo-btn ${
                risposto
                  ? opt === corretta
                    ? 'corretta'
                    : opt === ultimaRisposta
                      ? 'sbagliata'
                      : ''
                  : ''
              }`}
              onClick={() => gestisciRisposta(opt)}
              disabled={risposto}
            >
              <span className="opzione-articolo">{opt}</span>
            </button>
          ))}
        </div>

        {risposto && (
          <div className="feedback">
            {ultimaRisposta === corretta ? (
              <div className="feedback-corretto">
                <span>✅</span> Bene! {riempiFrase(esercizioCorrente.frase, corretta)}
              </div>
            ) : (
              <div className="feedback-sbagliato">
                <span>❌</span> Quasi! La risposta giusta è &quot;{corretta}&quot;: {riempiFrase(esercizioCorrente.frase, corretta)}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="star-progress">
        <span className={`star-singola ${stellaGiaGuadagnata(`esercizi/${moduloId}/${esercizioCorrente.indiceOriginale}`) ? 'piena' : 'vuota'}`}>
          {stellaGiaGuadagnata(`esercizi/${moduloId}/${esercizioCorrente.indiceOriginale}`) ? '⭐' : '☆'}
        </span>
      </div>
    </div>
  )
}

function riempiFrase(frase, valore) {
  return frase.replace('___', valore)
}

export default GrammarGame
