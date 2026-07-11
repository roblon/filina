import { useState, useEffect, useRef } from 'react'
import esercizioArticoli from '../data/articoli'
import { playMp3 } from '../utils/tts'
import { stellaGiaGuadagnata } from '../utils/stelle'
import mischia from '../utils/mischia'
import Riepilogo from './Riepilogo'
import type { RispostaQuiz } from '../types'

interface ParolaArticolo {
  parola: string
  emoji: string
  determinativo: string
  indeterminativo: string
}

const ARTICOLI_DETERMINATIVI = ['il', 'lo', "l'", 'la']
const ARTICOLI_INDETERMINATIVI = ['un', 'uno', "un'", 'una']

function generaOpzioni(parola: ParolaArticolo, tipo: string) {
  const pool = tipo === 'determinativo' ? ARTICOLI_DETERMINATIVI : ARTICOLI_INDETERMINATIVI
  const corretto = tipo === 'determinativo' ? parola.determinativo : parola.indeterminativo
  const altri = pool.filter(a => a !== corretto)
  const distrattori = mischia(altri).slice(0, 3)
  return mischia([corretto, ...distrattori])
}

function articoloCompleto(parola: ParolaArticolo, tipo: string) {
  const art = tipo === 'determinativo' ? parola.determinativo : parola.indeterminativo
  return art.endsWith("'") ? `${art}${parola.parola}` : `${art} ${parola.parola}`
}

function ArticoliGame({ onBack, onStarEarned }: { onBack: () => void; onStarEarned?: (key: string) => void }) {
  const [parole] = useState(() => mischia(esercizioArticoli.parole))

  const [indice, setIndice] = useState(0)
  const [punteggio, setPunteggio] = useState(0)
  const [risposto, setRisposto] = useState(false)
  const [fatto, setFatto] = useState(false)
  const [ultimaRisposta, setUltimaRisposta] = useState<string | null>(null)
  const [tipo, setTipo] = useState(() => Math.random() < 0.5 ? 'determinativo' : 'indeterminativo')
  const [opzioni, setOpzioni] = useState(() => generaOpzioni(parole[0], tipo))
  const [risposte, setRisposte] = useState<RispostaQuiz[]>([])

  const parolaCorrente = parole[indice]
  const ultimoIndiceParlato = useRef(-1)
  const audioPath = `${import.meta.env.BASE_URL}assets/audio/esercizi/articoli/${parolaCorrente.parola}-${tipo}.mp3`
  const audioPathParola = `${import.meta.env.BASE_URL}assets/audio/esercizi/articoli/${parolaCorrente.parola}.mp3`

  useEffect(() => {
    if (parolaCorrente && ultimoIndiceParlato.current !== indice) {
      playMp3(audioPath)
      ultimoIndiceParlato.current = indice
    }
  }, [indice, parolaCorrente, tipo, audioPath])

  function gestisciRisposta(articoloScelto: string) {
    if (risposto) return
    setRisposto(true)
    setUltimaRisposta(articoloScelto)
    const corretto = tipo === 'determinativo' ? parolaCorrente.determinativo : parolaCorrente.indeterminativo
    const giusta = articoloScelto === corretto
    if (giusta) {
      setPunteggio((p) => p + 1)
      onStarEarned?.(`esercizi/articoli/${parolaCorrente.parola}/${tipo}`)
    }
    const rispostaData = articoloScelto.endsWith("'") ? `${articoloScelto}${parolaCorrente.parola}` : `${articoloScelto} ${parolaCorrente.parola}`
    setRisposte(prev => [...prev, {
      domanda: `${parolaCorrente.emoji} ${parolaCorrente.parola} (${tipo})`,
      corretta: giusta,
      rispostaCorretta: `${articoloCompleto(parolaCorrente, tipo)}`,
      rispostaData,
      valoreSbagliato: giusta ? null : articoloScelto,
    }])
    setTimeout(prossimaDomanda, 700)
  }

  function prossimaDomanda() {
    if (indice + 1 >= parole.length) {
      setFatto(true)
      return
    }
    const nuovoIndice = indice + 1
    const nuovoTipo = crypto.getRandomValues(new Uint32Array(1))[0] % 2 === 0 ? 'determinativo' : 'indeterminativo'
    setIndice(nuovoIndice)
    setTipo(nuovoTipo)
    setRisposto(false)
    setUltimaRisposta(null)
    setOpzioni(generaOpzioni(parole[nuovoIndice], nuovoTipo))
  }

  if (!parolaCorrente) return null

  if (fatto) {
    return (
      <Riepilogo
        icona={esercizioArticoli.icona}
        nome={esercizioArticoli.nome}
        colore={esercizioArticoli.colore}
        punteggio={punteggio}
        totale={parole.length}
        risposte={risposte}
        onBack={onBack}
        grammatica
      />
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
            onClick={() => playMp3(audioPathParola)}
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
                <span>✅</span> Bene! {articoloCompleto(parolaCorrente, tipo)}!
              </div>
            ) : (
              <div className="feedback-sbagliato">
                <span>❌</span> L&apos;articolo {tipo} giusto è &quot;{corretto}&quot; → {articoloCompleto(parolaCorrente, tipo)}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="star-progress">
        <span className={`star-singola ${stellaGiaGuadagnata(`esercizi/articoli/${parolaCorrente.parola}/${tipo}`) ? 'piena' : 'vuota'}`}>
          {stellaGiaGuadagnata(`esercizi/articoli/${parolaCorrente.parola}/${tipo}`) ? '⭐' : '☆'}
        </span>
      </div>
    </div>
  )
}

export default ArticoliGame
