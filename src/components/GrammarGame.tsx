import { useState } from 'react'
import { playMp3 } from '../utils/tts'
import { stellaGiaGuadagnata } from '../utils/stelle'
import mischia from '../utils/mischia'
import useQuiz from '../utils/useQuiz'
import Riepilogo from './Riepilogo'
import type { Esercizio } from '../types'

interface GrammarGameProps {
  esercizi: Esercizio[]
  campo: string
  etichetta: string
  moduloId: string
  icona: string
  nome: string
  colore: string
  onBack: () => void
  onStarEarned?: (key: string) => void
}

interface EsercizioConIndice extends Esercizio {
  indiceOriginale: number
}

function generaOpzioni(corretta: string, pool: string[]): string[] {
  const altre = pool.filter(p => p !== corretta)
  const distrattori = mischia(altre).slice(0, 3)
  return mischia([corretta, ...distrattori])
}

function riempiFrase(frase: string, valore: string): string {
  return frase.replace('___', valore)
}

function GrammarGame({ esercizi: data, campo, etichetta, moduloId, icona, nome, colore, onBack, onStarEarned }: GrammarGameProps) {
  const pool = [...new Set(data.map(e => e[campo] as string))]

  const [esercizi] = useState<EsercizioConIndice[]>(() =>
    mischia(data.map((e, i) => ({ ...e, indiceOriginale: i })))
  )
  const [opzioni, setOpzioni] = useState<string[]>(() =>
    generaOpzioni(esercizi[0][campo] as string, pool)
  )

  const quiz = useQuiz({
    items: esercizi,
    getAudioPath: (item) => `${import.meta.env.BASE_URL}assets/audio/esercizi/${moduloId}/${String(item.indiceOriginale + 1).padStart(2, '0')}.mp3`,
    onStarEarned,
    getStarKey: (item) => `esercizi/${moduloId}/${item.indiceOriginale}`,
  })

  const { item: esercizioCorrente, indice, risposto, fatto, ultimaRisposta, punteggio, risposte, totale, rispondi } = quiz
  const corretta = esercizioCorrente[campo] as string
  const parti = esercizioCorrente.frase.split('___')
  const audioPath = `${import.meta.env.BASE_URL}assets/audio/esercizi/${moduloId}/${String(esercizioCorrente.indiceOriginale + 1).padStart(2, '0')}.mp3`

  function gestisciRisposta(scelta: string) {
    if (risposto) return
    const prossimo = esercizi[indice + 1]
    setOpzioni(generaOpzioni(prossimo ? (prossimo[campo] as string) : corretta, pool))
    rispondi(scelta, corretta, {
      domanda: `${esercizioCorrente.emoji} ${riempiFrase(esercizioCorrente.frase, '___')}`,
      rispostaCorretta: riempiFrase(esercizioCorrente.frase, corretta),
      rispostaData: riempiFrase(esercizioCorrente.frase, scelta),
      valoreSbagliato: scelta === corretta ? null : scelta,
    })
  }

  if (!esercizioCorrente) return null

  if (fatto) {
    return (
      <Riepilogo
        icona={icona}
        nome={nome}
        colore={colore}
        punteggio={punteggio}
        totale={totale}
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
              width: `${(indice / totale) * 100}%`,
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

export default GrammarGame
