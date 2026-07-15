import { useState, useEffect } from 'react'
import styles from './DitaGame.module.css'
import dita from '../data/dita'
import { playMp3 } from '../utils/tts'
import mischia from '../utils/mischia'
import Riepilogo from './Riepilogo'

interface Tassello {
  nome: string
  posizione: { x: number; y: number }
}

interface SlotGriglia {
  etichetta: string
  valore: Tassello | null
  bloccato: boolean
  atteso: Tassello
  indice: number
}

function randomPreInseriti(totale: number, conteggio: number) {
  const indici = Array.from({ length: totale }, (_, i) => i)
  for (let i = indici.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indici[i], indici[j]] = [indici[j], indici[i]]
  }
  return new Set(indici.slice(0, conteggio))
}

function inizializzaFase(fase: number) {
  const d = dita.domande[fase]
  const preInseriti = randomPreInseriti(d.tasselli.length, d.preInseriti)
  return {
    slots: d.tasselli.map((t, i) => ({
      etichetta: t.nome,
      valore: preInseriti.has(i) ? t : null,
      bloccato: preInseriti.has(i),
      atteso: t,
      indice: i,
    })),
    wallet: mischia(d.tasselli.filter((_, i) => !preInseriti.has(i))),
  }
}

function FaseGame({ fase, onCompletato, onStarEarned }: { fase: number; onCompletato: (fase: number, risultati: import('../types').RispostaQuiz[]) => void; onStarEarned: (key: string) => void }) {
  const init = inizializzaFase(fase)
  const [slots, setSlots] = useState<SlotGriglia[]>(init.slots)
  const [wallet, setWallet] = useState<Tassello[]>(init.wallet)
  const [selezionato, setSelezionato] = useState<number | null>(null)
  const [stato, setStato] = useState('gioco')
  const [slotErrati, setSlotErrati] = useState<Set<number>>(new Set())

  const domanda = dita.domande[fase]
  const audioPath = `${import.meta.env.BASE_URL}assets/audio/giochi/dita/${domanda.id}.mp3`

  useEffect(() => {
    playMp3(audioPath)
  }, [audioPath])

  function cliccaTassello(indiceWallet: number) {
    if (stato !== 'gioco') return
    setSelezionato(prev => {
      const nuovoSelezionato = prev === indiceWallet ? null : indiceWallet
      if (nuovoSelezionato !== null) {
        const tassello = wallet[nuovoSelezionato]
        const tileAudioPath = `${import.meta.env.BASE_URL}assets/audio/giochi/dita/${tassello.nome}.mp3`
        playMp3(tileAudioPath)
      }
      return nuovoSelezionato
    })
  }

  function cliccaSlot(indiceSlot: number) {
    if (stato === 'completato') return

    const slot = slots[indiceSlot]

    if (slot.valore && !slot.bloccato) {
      const s = slots.map(sl => ({ ...sl }))
      const w = [...wallet]
      w.push(slot.valore)
      s[indiceSlot] = { ...s[indiceSlot], valore: null }
      setSlots(s)
      setWallet(mischia(w))
      setSelezionato(null)
      setStato('gioco')
      setSlotErrati(new Set())
      return
    }

    if (selezionato !== null && !slot.valore && !slot.bloccato) {
      const s = slots.map(sl => ({ ...sl }))
      const w = [...wallet]
      s[indiceSlot] = { ...s[indiceSlot], valore: w[selezionato] }
      w.splice(selezionato, 1)
      setSlots(s)
      setWallet(w)
      setSelezionato(null)
      setStato('gioco')
      setSlotErrati(new Set())

      if (s.every(sl => sl.valore !== null)) {
        controlla(s)
      }
    }
  }

  function controlla(griglia: SlotGriglia[]) {
    const d = dita.domande[fase]
    const errati = new Set<number>()
    let ok = true
    griglia.forEach((s, i) => {
      if (!s.valore || s.valore.nome !== s.atteso.nome) {
        errati.add(i)
        ok = false
      }
    })

    if (ok) {
      setStato('completato')
      onStarEarned(`giochi/dita/${d.id}`)
      const risultati: import('../types').RispostaQuiz[] = griglia.map(s => ({
        domanda: s.etichetta,
        corretta: true,
        rispostaCorretta: s.atteso.nome,
        rispostaData: s.valore!.nome,
      }))
      onCompletato(fase, risultati)
    } else {
      setStato('errato')
      setSlotErrati(errati)
    }
  }

  const immagineUrl = domanda.tipo === 'mano'
    ? `${import.meta.env.BASE_URL}assets/images/mano.svg`
    : `${import.meta.env.BASE_URL}assets/images/piede.svg`

  return (
    <div className={styles.ditaArea}>
      <div className={styles.ditaDomanda}>
        <span className={styles.ditaDomandaIcona}>{dita.icona}</span>
        <p className={styles.ditaDomandaTesto}>
          {domanda.testo}
          <button className="btn-speak" onClick={() => playMp3(audioPath)} aria-label="Ascolta la domanda">
            🔈
          </button>
        </p>
      </div>

      <div className={styles.ditaContainer}>
        <div className={styles.ditaImmagineWrapper}>
          <img src={immagineUrl} alt={domanda.titolo} className={styles.ditaImmagine} />
          
          {slots.map((slot, i) => (
            <div
              key={i}
              className={`${styles.ditaSlot} ${
                slot.valore && !slot.bloccato ? styles.pieno : ''
              } ${slot.bloccato ? styles.bloccato : ''} ${
                slot.valore === null && !slot.bloccato ? styles.vuoto : ''
              } ${slotErrati.has(i) ? styles.errato : ''} ${
                selezionato !== null && slot.valore === null && !slot.bloccato ? styles.pronto : ''
              }`}
              style={{ left: `${slot.atteso.posizione.x}%`, top: `${slot.atteso.posizione.y}%` }}
              onClick={() => cliccaSlot(i)}
            >
              {slot.valore ? (
                <span className={styles.ditaSlotValore}>{slot.valore.nome}</span>
              ) : (
                <span className={styles.ditaSlotPlaceholder}>?</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {stato === 'errato' && (
        <div className={`${styles.ditaFeedback} ${styles.ditaFeedbackErrato}`}>
          ❌ Alcuni nomi non sono nel posto giusto. Clicca quelli evidenziati per correggerli.
        </div>
      )}

      {wallet.length > 0 && stato !== 'completato' && (
        <div className={styles.ditaWallet}>
          <p className={styles.ditaWalletLabel}>Nomi da posizionare:</p>
          <div className={styles.ditaTasselli}>
            {wallet.map((valore, i) => (
              <div
                key={`${valore.nome}-${i}`}
                className={`${styles.ditaTassello} ${selezionato === i ? styles.selezionato : ''}`}
                onClick={() => cliccaTassello(i)}
              >
                {valore.nome}
              </div>
            ))}
          </div>
        </div>
      )}

      {stato === 'completato' && (
        <div className={styles.ditaSuccesso}>
          <div className={styles.ditaSuccessoIcona}>✅</div>
          <p>Ottimo! Hai completato &quot;{domanda.titolo}&quot;!</p>
        </div>
      )}

      {stato === 'gioco' && wallet.length === 0 && slots.every(s => s.valore !== null) && (
        <div className={`${styles.ditaFeedback} ${styles.ditaFeedbackCorretto}`}>
          ✅ Controllo in corso...
        </div>
      )}
    </div>
  )
}

function DitaGame({ onBack, onStarEarned }: { onBack: () => void; onStarEarned: (key: string) => void }) {
  const [fase, setFase] = useState(0)
  const [stelleFase, setStelleFase] = useState(new Set())
  const [risultatiFasi, setRisultatiFasi] = useState<Map<number, import('../types').RispostaQuiz[]>>(new Map())
  const totaleFasi = dita.domande.length

  function onCompletato(faseCompletata: number, risultati: import('../types').RispostaQuiz[]) {
    setStelleFase(prev => new Set([...prev, faseCompletata]))
    setRisultatiFasi(prev => new Map(prev).set(faseCompletata, risultati))
  }

  function vaiFase(i: number) {
    setFase(i)
  }

  function prossimaFase() {
    if (fase + 1 >= totaleFasi) return
    setFase(prev => prev + 1)
  }

  function fasePrecedente() {
    if (fase <= 0) return
    setFase(prev => prev - 1)
  }

  const tutteCompletate = dita.domande.every((_, i) => stelleFase.has(i))

  const tutteRisultati = Array.from(risultatiFasi.values()).flat()
  const punteggioFinale = tutteRisultati.filter(r => r.corretta).length

  if (tutteCompletate) {
    return (
      <Riepilogo
        icona={dita.icona}
        nome={dita.nome}
        colore={dita.colore}
        punteggio={punteggioFinale}
        totale={tutteRisultati.length}
        risposte={tutteRisultati}
        onBack={onBack}
      />
    )
  }

  return (
    <div className={styles.ditaGame}>
      <div className={styles.ditaHeader}>
        <button className="btn-back" onClick={onBack}>
          ← Indietro
        </button>
        <div className={styles.ditaProgressDots}>
          {dita.domande.map((d, i) => (
            <span
              key={d.id}
              className={`${styles.ditaDot}${i === fase ? ` ${styles.attivo}` : ''}${stelleFase.has(i) ? ` ${styles.completato}` : ''}`}
              onClick={() => vaiFase(i)}
            />
          ))}
        </div>
        <span className={styles.ditaFaseLabel}>{fase + 1}/{totaleFasi}</span>
      </div>

      <FaseGame
        key={fase}
        fase={fase}
        onCompletato={onCompletato}
        onStarEarned={onStarEarned}
      />

      {!tutteCompletate && (
        <div className={styles.ditaNavContainer}>
          <button
            className={styles.ditaNavBtn}
            disabled={fase === 0}
            onClick={fasePrecedente}
          >
            ← Precedente
          </button>
          <span className={styles.ditaNavCounter}>{fase + 1} / {totaleFasi}</span>
          <button
            className={styles.ditaNavBtn}
            disabled={fase === totaleFasi - 1}
            onClick={prossimaFase}
          >
            Successivo →
          </button>
        </div>
      )}
    </div>
  )
}

export default DitaGame
