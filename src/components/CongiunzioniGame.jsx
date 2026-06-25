import { useState, useEffect, useRef } from 'react'
import esercizioCongiunzioni from '../data/congiunzioni'
import { playMp3, stopAudio } from '../utils/tts'

function mischia(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TUTTE_CONGIUNZIONI = ['o', 'e', 'ma', 'perché', 'se', 'mentre', 'quindi', 'però', 'che', 'oppure']

function generaOpzioni(corretta) {
  const altre = TUTTE_CONGIUNZIONI.filter(p => p !== corretta)
  const distrattori = mischia(altre).slice(0, 3)
  return mischia([corretta, ...distrattori])
}

function CongiunzioniGame({ onBack, onStarEarned }) {
  const [esercizi] = useState(() => {
    const conIndice = esercizioCongiunzioni.esercizi.map((e, i) => ({ ...e, indiceOriginale: i }))
    return mischia(conIndice)
  })

  const [indice, setIndice] = useState(0)
  const [punteggio, setPunteggio] = useState(0)
  const [risposto, setRisposto] = useState(false)
  const [fatto, setFatto] = useState(false)
  const [ultimaRisposta, setUltimaRisposta] = useState(null)
  const [opzioni, setOpzioni] = useState(() => generaOpzioni(esercizi[0].congiunzione))

  const esercizioCorrente = esercizi[indice]
  const ultimoIndiceParlato = useRef(-1)
  const corretta = esercizioCorrente.congiunzione
  const parti = esercizioCorrente.frase.split('___')
  const audioPath = `${import.meta.env.BASE_URL}assets/audio/esercizi/congiunzioni/${String(esercizioCorrente.indiceOriginale + 1).padStart(2, '0')}.mp3`

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
    if (scelta === corretta) {
      setPunteggio((p) => p + 1)
      onStarEarned?.(`esercizi/congiunzioni/${esercizioCorrente.indiceOriginale}`)
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
    setOpzioni(generaOpzioni(esercizi[nuovoIndice].congiunzione))
  }

  if (!esercizioCorrente) return null

  if (fatto) {
    return (
      <div className="risultati-screen">
        <div className="risultati-card" style={{ '--cat-color': esercizioCongiunzioni.colore }}>
          <span className="risultati-icona">{esercizioCongiunzioni.icona}</span>
          <h2>Complimenti!</h2>
          <p className="risultati-testo">
            Hai completato <strong>{esercizioCongiunzioni.nome}</strong>!
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
              background: esercizioCongiunzioni.colore,
            }}
          />
        </div>
        <span className="punteggio-corrente">
          {esercizioCongiunzioni.icona} {punteggio}/{indice + (risposto ? 1 : 0)}
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

        <div className="domanda-label">Completa la frase con la congiunzione giusta</div>

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
          {opzioni.map((cong, i) => (
            <button
              key={cong + i}
              className={`opzione-btn articolo-btn ${
                risposto
                  ? cong === corretta
                    ? 'corretta'
                    : cong === ultimaRisposta
                      ? 'sbagliata'
                      : ''
                  : ''
              }`}
              onClick={() => gestisciRisposta(cong)}
              disabled={risposto}
            >
              <span className="opzione-articolo">{cong}</span>
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
              style={{ background: esercizioCongiunzioni.colore }}
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

function riempiFrase(frase, congiunzione) {
  return frase.replace('___', congiunzione)
}

export default CongiunzioniGame
