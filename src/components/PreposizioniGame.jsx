import { useState, useEffect, useRef } from 'react'
import esercizioPreposizioni from '../data/preposizioni'
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

function PreposizioniGame({ onBack, onStarEarned }) {
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
  const [risposte, setRisposte] = useState([])

  const esercizioCorrente = esercizi[indice]
  const ultimoIndiceParlato = useRef(-1)
  const corretta = MAP[`${esercizioCorrente.preposizione}+${esercizioCorrente.articolo}`]
  const parti = esercizioCorrente.frase.split('___')
  const audioPath = `${import.meta.env.BASE_URL}assets/audio/esercizi/preposizioni-articolate/${String(esercizioCorrente.indiceOriginale + 1).padStart(2, '0')}.mp3`

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
      onStarEarned?.(`esercizi/preposizioni-articolate/${esercizioCorrente.indiceOriginale}`)
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
    setOpzioni(generaOpzioni(MAP[`${esercizi[nuovoIndice].preposizione}+${esercizi[nuovoIndice].articolo}`]))
  }

  if (!esercizioCorrente) return null

  if (fatto) {
    return (
      <Riepilogo
        icona={esercizioPreposizioni.icona}
        nome={esercizioPreposizioni.nome}
        colore={esercizioPreposizioni.colore}
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
            onClick={() => playMp3(audioPath)}
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
        <span className={`star-singola ${stellaGiaGuadagnata(`esercizi/preposizioni-articolate/${esercizioCorrente.indiceOriginale}`) ? 'piena' : 'vuota'}`}>
          {stellaGiaGuadagnata(`esercizi/preposizioni-articolate/${esercizioCorrente.indiceOriginale}`) ? '⭐' : '☆'}
        </span>
      </div>
    </div>
  )
}

export default PreposizioniGame
