import type { RispostaQuiz } from '../types'
import styles from './Riepilogo.module.css'

interface RiepilogoProps {
  icona: string
  nome: string
  colore: string
  punteggio: number
  totale: number
  risposte: RispostaQuiz[]
  onBack: () => void
  grammatica?: boolean
}

function TestoConErrore({ testo, errore }: { testo: string; errore?: string | null }) {
  if (!errore) return <>{testo}</>
  const re = new RegExp(`(${errore.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = testo.split(re)
  return <>{parts.map((part, i) =>
    part.toLowerCase() === errore.toLowerCase()
      ? <span key={i} className="errore-testo">{part}</span>
      : part
  )}</>
}

function Riepilogo({ icona, nome, colore, punteggio, totale, risposte, onBack, grammatica }: RiepilogoProps) {
  return (
    <div className={styles.risultatiScreen}>
      <div className={styles.risultatiCard} style={{ '--cat-color': colore } as React.CSSProperties}>
        <span className={styles.risultatiIcona}>{icona}</span>
        <h2>Complimenti!</h2>
        <p className={styles.risultatiTesto}>
          Hai completato <strong>{nome}</strong>!
        </p>
        <div className={styles.punteggioFinale}>
          <span className={styles.punteggioNumero}>{punteggio}</span>
          <span className={styles.punteggioDiv}>/</span>
          <span className={styles.punteggioTotale}>{totale}</span>
        </div>

        <div className={styles.riepilogoLista}>
          {risposte.map((r, i) => (
            <div key={i} className={`${styles.riepilogoRiga} ${r.corretta ? styles.giusta : styles.sbagliata}`}>
              <span className={styles.riepilogoIcona}>{r.corretta ? '✅' : '❌'}</span>
              {grammatica && (
                <span className={styles.riepilogoDomanda}>
                  {r.corretta ? r.rispostaCorretta : <TestoConErrore testo={r.rispostaData} errore={r.valoreSbagliato} />}
                </span>
              )}
              {!grammatica && (
                <>
                  <span className={styles.riepilogoDomanda}>{r.domanda}</span>
                  {!r.corretta && (
                    <span className={styles.riepilogoCorrezione}>
                      {r.rispostaData} → {r.rispostaCorretta}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className={styles.risultatiAzioni}>
          <button className="btn btn-riprova" onClick={onBack}>
            🔙 Scegli un altro argomento
          </button>
        </div>
      </div>
    </div>
  )
}

export default Riepilogo
