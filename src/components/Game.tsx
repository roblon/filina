import { useState, useEffect, useRef } from 'react'
import { playMp3 } from '../utils/tts'
import { stellaGiaGuadagnata } from '../utils/stelle'
import mischia from '../utils/mischia'
import Riepilogo from './Riepilogo'
import type { Parola, CategoriaVocabolario, RispostaQuiz } from '../types'

interface GameProps {
  categoria: CategoriaVocabolario
  onBack: () => void
  onStarEarned?: (key: string) => void
}

function generaOpzioni(tutte: Parola[], idx: number): Parola[] {
  const corretta = tutte[idx]
  const altre = tutte.filter((p) => p.parola !== corretta.parola)
  const distrattori = mischia(altre).slice(0, 3)
  return mischia([corretta, ...distrattori])
}

function testoCompleto(p: Parola): string {
  return p.articolo.endsWith("'") ? `${p.articolo}${p.parola}` : `${p.articolo} ${p.parola}`
}

function Game({ categoria, onBack, onStarEarned }: GameProps) {
  const [parole] = useState<Parola[]>(() => mischia(categoria.parole))

  const [indice, setIndice] = useState(0)
  const [punteggio, setPunteggio] = useState(0)
  const [risposto, setRisposto] = useState(false)
  const [fatto, setFatto] = useState(false)
  const [ultimaRisposta, setUltimaRisposta] = useState<Parola | null>(null)
  const [opzioni, setOpzioni] = useState<Parola[]>(() => generaOpzioni(parole, 0))
  const [risposte, setRisposte] = useState<RispostaQuiz[]>([])

  const modalita = Math.floor(indice / 5) % 2 === 0 ? 'parola-emoji' : 'emoji-parola'
  const parolaCorrente = parole[indice]
  const ultimoIndiceParlato = useRef(-1)
  const audioPath = `${import.meta.env.BASE_URL}assets/audio/giochi/${categoria.id}/${parolaCorrente.parola}.mp3`

  useEffect(() => {
    if (parolaCorrente && ultimoIndiceParlato.current !== indice) {
      playMp3(audioPath)
      ultimoIndiceParlato.current = indice
    }
  }, [indice, parolaCorrente, audioPath])

  function gestisciRisposta(opzione: Parola) {
    if (risposto) return
    setRisposto(true)
    setUltimaRisposta(opzione)
    const giusta = opzione.parola === parolaCorrente.parola
    if (giusta) {
      setPunteggio((p) => p + 1)
      onStarEarned?.(`giochi/${categoria.id}/${parolaCorrente.parola}`)
    }
    setRisposte(prev => [...prev, {
      domanda: `${parolaCorrente.emoji} ${testoCompleto(parolaCorrente)}`,
      corretta: giusta,
      rispostaCorretta: testoCompleto(parolaCorrente),
      rispostaData: testoCompleto(opzione),
    }])
    setTimeout(prossimaDomanda, 700)
  }

  function prossimaDomanda() {
    if (indice + 1 >= parole.length) {
      setFatto(true)
      return
    }
    const nuovoIndice = indice + 1
    setIndice(nuovoIndice)
    setRisposto(false)
    setUltimaRisposta(null)
    setOpzioni(generaOpzioni(parole, nuovoIndice))
  }

  if (!parolaCorrente) return null

  if (fatto) {
    return (
      <Riepilogo
        icona={categoria.icona}
        nome={categoria.nome}
        colore={categoria.colore}
        punteggio={punteggio}
        totale={parole.length}
        risposte={risposte}
        onBack={onBack}
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
              width: `${(indice / parole.length) * 100}%`,
              background: categoria.colore,
            }}
          />
        </div>
        <span className="punteggio-corrente">
          {parolaCorrente.emoji} {punteggio}/{indice + (risposto ? 1 : 0)}
        </span>
      </div>

      <div className="game-area">
        {modalita === 'parola-emoji' ? (
          <>
            <div className="domanda-label">Quale immagine rappresenta...</div>
            <div className="parola-corrente">
              {testoCompleto(parolaCorrente)}
              <button className="btn-speak" onClick={() => playMp3(audioPath)} aria-label="Ascolta la parola">
                🔈
              </button>
            </div>
            <div className="opzioni-grid">
              {opzioni.map((op, i) => (
                <button
                  key={op.parola + i}
                  className={`opzione-btn ${
                    risposto
                      ? op.parola === parolaCorrente.parola
                        ? 'corretta'
                        : op.parola === ultimaRisposta?.parola
                          ? 'sbagliata'
                          : ''
                      : ''
                  }`}
                  onClick={() => gestisciRisposta(op)}
                  disabled={risposto}
                >
                  <span className="opzione-emoji">{op.emoji}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="domanda-label">Quale parola corrisponde a...</div>
            <div className="parola-corrente emoji-grande">
              {parolaCorrente.emoji}
              <button className="btn-speak" onClick={() => playMp3(audioPath)} aria-label="Ascolta la parola">
                🔈
              </button>
            </div>
            <div className="opzioni-grid parole">
              {opzioni.map((op, i) => (
                <button
                  key={op.parola + i}
                  className={`opzione-btn parola-btn ${
                    risposto
                      ? op.parola === parolaCorrente.parola
                        ? 'corretta'
                        : op.parola === ultimaRisposta?.parola
                          ? 'sbagliata'
                          : ''
                      : ''
                  }`}
                  onClick={() => gestisciRisposta(op)}
                  disabled={risposto}
                >
                  <span className="opzione-parola">{testoCompleto(op)}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {risposto && (
          <div className="feedback">
            {ultimaRisposta?.parola === parolaCorrente.parola ? (
              <div className="feedback-corretto">
                <span>✅</span> Bene! È &quot;{testoCompleto(parolaCorrente)}&quot;!
              </div>
            ) : (
              <div className="feedback-sbagliato">
                <span>❌</span> Quasi! La risposta giusta era &quot;{testoCompleto(parolaCorrente)}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      <div className="star-progress">
        <span className={`star-singola ${stellaGiaGuadagnata(`giochi/${categoria.id}/${parolaCorrente.parola}`) ? 'piena' : 'vuota'}`}>
          {stellaGiaGuadagnata(`giochi/${categoria.id}/${parolaCorrente.parola}`) ? '⭐' : '☆'}
        </span>
      </div>
    </div>
  )
}

export default Game
