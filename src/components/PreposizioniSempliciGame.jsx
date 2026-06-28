import { useState, useEffect, useRef } from 'react'
import esercizioPreposizioniSemplici from '../data/preposizioni-semplici'
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

const TUTTE_PREPOSIZIONI = ['di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra']

function generaOpzioni(corretta) {
  const altre = TUTTE_PREPOSIZIONI.filter(p => p !== corretta)
  const distrattori = mischia(altre).slice(0, 3)
  return mischia([corretta, ...distrattori])
}

function PreposizioniSempliciGame({ onBack, onStarEarned }) {
  const [esercizi] = useState(() => {
    const conIndice = esercizioPreposizioniSemplici.esercizi.map((e, i) => ({ ...e, indiceOriginale: i }))
    return mischia(conIndice)
  })

  const [indice, setIndice] = useState(0)
  const [punteggio, setPunteggio] = useState(0)
  const [risposto, setRisposto] = useState(false)
  const [fatto, setFatto] = useState(false)
  const [ultimaRisposta, setUltimaRisposta] = useState(null)
  const [opzioni, setOpzioni] = useState(() => generaOpzioni(esercizi[0].preposizione))
  const [risposte, setRisposte] = useState([])

  const esercizioCorrente = esercizi[indice]
  const ultimoIndiceParlato = useRef(-1)
  const corretta = esercizioCorrente.preposizione
  const parti = esercizioCorrente.frase.split('___')
  const audioPath = `${import.meta.env.BASE_URL}assets/audio/esercizi/preposizioni-semplici/${String(esercizioCorrente.indiceOriginale + 1).padStart(2, '0')}.mp3`

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
      onStarEarned?.(`esercizi/preposizioni-semplici/${esercizioCorrente.indiceOriginale}`)
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
    setOpzioni(generaOpzioni(esercizi[nuovoIndice].preposizione))
  }

  if (!esercizioCorrente) return null

  if (fatto) {
    return (
      <Riepilogo
        icona={esercizioPreposizioniSemplici.icona}
        nome={esercizioPreposizioniSemplici.nome}
        colore={esercizioPreposizioniSemplici.colore}
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
            onClick={() => playMp3(audioPath)}
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
          </div>
        )}
      </div>

      <div className="star-progress">
        <span className={`star-singola ${stellaGiaGuadagnata(`esercizi/preposizioni-semplici/${esercizioCorrente.indiceOriginale}`) ? 'piena' : 'vuota'}`}>
          {stellaGiaGuadagnata(`esercizi/preposizioni-semplici/${esercizioCorrente.indiceOriginale}`) ? '⭐' : '☆'}
        </span>
      </div>
    </div>
  )
}

function riempiFrase(frase, preposizione) {
  return frase.replace('___', preposizione)
}

export default PreposizioniSempliciGame
