import { useState, useRef, useEffect } from 'react'
import { playMp3 } from '../utils/tts'
import { stellaGiaGuadagnata } from '../utils/stelle'
import mischia from '../utils/mischia'
import Riepilogo from './Riepilogo'
import type { Storia, RispostaQuiz } from '../types'
import styles from './StoriaGame.module.css'

interface Opzione {
  testo: string
  corretta: boolean
}

interface Props {
  storia: Storia
  onBack: () => void
  onStarEarned?: (key: string) => void
}

function StoriaGame({ storia, onBack, onStarEarned }: Props) {
  const [fase, setFase] = useState('video')
  const [indice, setIndice] = useState(0)
  const [punteggio, setPunteggio] = useState(0)
  const [risposto, setRisposto] = useState(false)
  const [ultimaRisposta, setUltimaRisposta] = useState<Opzione | null>(null)
  const [fatto, setFatto] = useState(false)
  const [risposte, setRisposte] = useState<RispostaQuiz[]>([])
  const [videoProgress, setVideoProgress] = useState(0)
  const [opzioni] = useState<Opzione[][]>(() => storia.domande.map((d: import('../types').DomandaStoria) => mischia(
    d.opzioni.map((t: string, i: number) => ({ testo: t, corretta: i === d.corretta }))
  )))
  const videoRef = useRef<HTMLVideoElement>(null)
  const ultimoIndiceParlato = useRef(-1)

  const videoPath = `${import.meta.env.BASE_URL}assets/video/${storia.video}`

  const domandaCorrente = fase === 'quiz' ? storia.domande[indice] : null
  const audioPath = domandaCorrente
    ? `${import.meta.env.BASE_URL}assets/audio/storie/${storia.id}/domanda-${indice + 1}.mp3`
    : null

  useEffect(() => {
    if (audioPath && ultimoIndiceParlato.current !== indice) {
      playMp3(audioPath)
      ultimoIndiceParlato.current = indice
    }
  }, [indice, audioPath])

  function gestisciRisposta(opzione: Opzione) {
    if (risposto) return
    setRisposto(true)
    setUltimaRisposta(opzione)
    const giusta = opzione.corretta
    if (giusta) {
      setPunteggio((p) => p + 1)
      onStarEarned?.(`storie/${storia.id}/q${indice}`)
    }
    setRisposte(prev => [...prev, {
      domanda: storia.domande[indice].domanda,
      corretta: giusta,
      rispostaCorretta: storia.domande[indice].opzioni[storia.domande[indice].corretta],
      rispostaData: opzione.testo,
    }])
    setTimeout(prossimaDomanda, 700)
  }

  function prossimaDomanda() {
    if (indice + 1 >= storia.domande.length) {
      setFatto(true)
      return
    }
    setIndice(i => i + 1)
    setRisposto(false)
    setUltimaRisposta(null)
  }

  if (fatto) {
    return (
      <Riepilogo
        icona={storia.icona}
        nome={storia.nome}
        colore={storia.colore}
        punteggio={punteggio}
        totale={storia.domande.length}
        risposte={risposte}
        onBack={onBack}
      />
    )
  }

  if (fase === 'video') {
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
                width: `${videoProgress}%`,
                background: storia.colore,
              }}
            />
          </div>
          <span className="punteggio-corrente">Video</span>
        </div>
        <div className={styles.storiaVideoContainer}>
          <video
            ref={videoRef}
            className={styles.storiaVideo}
            src={videoPath}
            autoPlay
            controls
            onTimeUpdate={(e) => {
              const target = e.target as HTMLVideoElement
              const dur = target.duration || 42
              setVideoProgress((target.currentTime / dur) * 100)
            }}
            onEnded={() => setFase('quiz')}
            playsInline
          />
          <button className={`btn-back ${styles.videoSkipBtn}`} onClick={() => setFase('quiz')}>
            Salta video →
          </button>
        </div>
      </div>
    )
  }

  const domanda = storia.domande[indice]
  const ops = opzioni[indice]

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
              width: `${(indice / storia.domande.length) * 100}%`,
              background: storia.colore,
            }}
          />
        </div>
        <span className="punteggio-corrente">
          {punteggio}/{indice + (risposto ? 1 : 0)}
        </span>
      </div>

      <div className="game-area">
        <div className="domanda-label">Domanda {indice + 1} di {storia.domande.length}</div>
        <div className="parola-corrente">
          {domanda.domanda}
          <button className="btn-speak" onClick={() => audioPath && playMp3(audioPath)} aria-label="Ascolta la domanda">
            🔈
          </button>
        </div>

        <div className={`opzioni-grid ${styles.opzioniGridStorie}`}>
          {ops.map((op: Opzione, i: number) => (
            <button
              key={i}
              className={`opzione-btn parola-btn ${
                risposto
                  ? op.corretta
                    ? 'corretta'
                    : op === ultimaRisposta
                      ? 'sbagliata'
                      : ''
                  : ''
              }`}
              onClick={() => gestisciRisposta(op)}
              disabled={risposto}
            >
              <span className="opzione-parola">{op.testo}</span>
            </button>
          ))}
        </div>

        {risposto && (
          <div className="feedback">
            {ultimaRisposta?.corretta ? (
              <div className="feedback-corretto">
                <span>✅</span> Corretto!
              </div>
            ) : (
              <div className="feedback-sbagliato">
                <span>❌</span> La risposta giusta era: &quot;{storia.domande[indice].opzioni[storia.domande[indice].corretta]}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      <div className="star-progress">
        <span className={`star-singola ${stellaGiaGuadagnata(`storie/${storia.id}/q${indice}`) ? 'piena' : 'vuota'}`}>
          {stellaGiaGuadagnata(`storie/${storia.id}/q${indice}`) ? '⭐' : '☆'}
        </span>
      </div>
    </div>
  )
}

export default StoriaGame
