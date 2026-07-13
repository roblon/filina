import { useState, useEffect } from 'react'
import styles from './OrologioGame.module.css'
import orologio from '../data/orologio'
import { playMp3 } from '../utils/tts'
import mischia from '../utils/mischia'
import ClockIcon from './ClockIcon'
import Riepilogo from './Riepilogo'

interface Tassello {
  nome: string
  ore: number
  minuti: number
  descrizione: string
}

interface SlotGriglia {
  etichetta: string
  descrizione: string
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
  const d = orologio.domande[fase]
  const preInseriti = randomPreInseriti(d.tasselli.length, d.preInseriti)
  return {
    grid: d.tasselli.map((t, i) => ({
      etichetta: t.nome,
      descrizione: t.descrizione,
      valore: preInseriti.has(i) ? t : null,
      bloccato: preInseriti.has(i),
      atteso: t,
      indice: i,
    })),
    wallet: mischia(d.tasselli.filter((_, i) => !preInseriti.has(i))),
  }
}

function FaseGame({ fase, onCompletato, onProsegui, onStarEarned }: { fase: number; onCompletato: (fase: number, risultati: import('../types').RispostaQuiz[]) => void; onProsegui: (fase: number, risultati: import('../types').RispostaQuiz[]) => void; onStarEarned: (chiave: string) => void }) {
  const init = inizializzaFase(fase)
  const [grid, setGrid] = useState<SlotGriglia[]>(init.grid)
  const [wallet, setWallet] = useState<Tassello[]>(init.wallet)
  const [selezionato, setSelezionato] = useState<number | null>(null)
  const [stato, setStato] = useState('gioco')
  const [slotErrati, setSlotErrati] = useState<Set<number>>(new Set())

  const domanda = orologio.domande[fase]
  const audioPath = `${import.meta.env.BASE_URL}assets/audio/giochi/orologio/${domanda.id}.mp3`

  useEffect(() => {
    playMp3(audioPath)
  }, [audioPath])

  function cliccaTassello(indiceWallet: number) {
    if (stato !== 'gioco') return
    setSelezionato(prev => {
      const nuovoSelezionato = prev === indiceWallet ? null : indiceWallet
      if (nuovoSelezionato !== null) {
        const tassello = wallet[nuovoSelezionato]
        const audioPath = `${import.meta.env.BASE_URL}assets/audio/giochi/orologio/${tassello.nome.replace(':', '-')}.mp3`
        playMp3(audioPath)
      }
      return nuovoSelezionato
    })
  }

  function cliccaSlot(indiceSlot: number) {
    if (stato === 'completato') return

    const slot = grid[indiceSlot]

    if (slot.valore && !slot.bloccato) {
      const g = grid.map(s => ({ ...s }))
      const w = [...wallet]
      w.push(slot.valore)
      g[indiceSlot] = { ...g[indiceSlot], valore: null }
      setGrid(g)
      setWallet(mischia(w))
      setSelezionato(null)
      setStato('gioco')
      setSlotErrati(new Set())
      return
    }

    if (selezionato !== null && !slot.valore && !slot.bloccato) {
      const g = grid.map(s => ({ ...s }))
      const w = [...wallet]
      g[indiceSlot] = { ...g[indiceSlot], valore: w[selezionato] }
      w.splice(selezionato, 1)
      setGrid(g)
      setWallet(w)
      setSelezionato(null)
      setStato('gioco')
      setSlotErrati(new Set())

      if (g.every(s => s.valore !== null)) {
        controlla(g)
      }
    }
  }

  function controlla(griglia: SlotGriglia[]) {
    const errati = new Set<number>()
    let ok = true
    griglia.forEach((s: SlotGriglia, i: number) => {
      if (!s.valore || s.valore.nome !== s.atteso.nome) {
        errati.add(i)
        ok = false
      }
    })

    if (ok) {
      setStato('completato')
      const chiave = `giochi/orologio/${orologio.domande[fase].id}`
      onStarEarned(chiave)
    } else {
      setStato('errato')
      setSlotErrati(errati)
    }
  }

  function handleDragStart(e: React.DragEvent, sorgente: string, indice: number) {
    e.dataTransfer.setData('application/json', JSON.stringify({ sorgente, indice }))
  }

  function handleDragOver(e: React.DragEvent) {
    if (stato === 'gioco') e.preventDefault()
  }

  function handleDrop(e: React.DragEvent, indiceSlot: number) {
    e.preventDefault()
    if (stato !== 'gioco') return
    const data = JSON.parse(e.dataTransfer.getData('application/json'))
    if (data.sorgente === 'wallet') {
      const slot = grid[indiceSlot]
      if (!slot.valore && !slot.bloccato) {
        const g = grid.map(s => ({ ...s }))
        const w = [...wallet]
        g[indiceSlot] = { ...g[indiceSlot], valore: w[data.indice] }
        w.splice(data.indice, 1)
        setGrid(g)
        setWallet(w)
        setSelezionato(null)
        setSlotErrati(new Set())
        if (g.every(s => s.valore !== null)) {
          controlla(g)
        }
      }
    }
  }

  return (
    <div className={styles.orologioArea}>
      <div className={styles.orologioDomanda}>
        <span className={styles.orologioDomandaIcona}>{orologio.icona}</span>
        <p className={styles.orologioDomandaTesto}>
          {domanda.testo}
          <button className="btn-speak" onClick={() => playMp3(audioPath)} aria-label="Ascolta la domanda">
            🔈
          </button>
        </p>
      </div>

      <div
        className={styles.orologioGriglia}
        style={{ '--num-colonne': 4 } as React.CSSProperties}
      >
        {grid.map((slot, i) => (
          <div
            key={i}
            className={`${styles.orologioSlot} ${
              slot.valore && !slot.bloccato ? styles.pieno : ''
            } ${slot.bloccato ? styles.bloccato : ''} ${
              slot.valore === null && !slot.bloccato ? styles.vuoto : ''
            } ${slotErrati.has(i) ? styles.errato : ''} ${
              selezionato !== null && slot.valore === null && !slot.bloccato ? styles.pronto : ''
            }`}
            onClick={() => cliccaSlot(i)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
          >
            {slot.valore ? (
              <>
                <span className={styles.orologioSlotValore}>
                  <ClockIcon ore={slot.valore.ore} minuti={slot.valore.minuti} size={48} />
                </span>
                <span className={styles.orologioSlotEtichetta}>{slot.etichetta}</span>
              </>
            ) : (
              <span className={styles.orologioSlotEtichetta}>{slot.etichetta}</span>
            )}
          </div>
        ))}
      </div>

      <button
        className="btn btn-riprova"
        onClick={() => {
          const risultati: import('../types').RispostaQuiz[] = grid.map(s => ({
            domanda: s.descrizione,
            corretta: s.valore?.nome === s.atteso.nome,
            rispostaCorretta: s.atteso.nome,
            rispostaData: s.valore?.nome ?? '',
          }))
          onProsegui(fase, risultati)
        }}
      >
        Avanti →
      </button>

      {wallet.length > 0 && stato !== 'completato' && (
        <div className={styles.orologioWallet} onDragOver={handleDragOver}>
          <p className={styles.orologioWalletLabel}>Orologi da posizionare:</p>
          <div className={styles.orologioTasselli}>
            {wallet.map((valore, i) => (
              <div className={styles.orologioTasselloWrapper} key={`${valore.nome}-${i}`}>
                <div
                  className={`${styles.orologioTassello} ${selezionato === i ? styles.selezionato : ''}`}
                  draggable={stato === 'gioco'}
                  onClick={() => cliccaTassello(i)}
                  onDragStart={(e) => handleDragStart(e, 'wallet', i)}
                >
                  <ClockIcon ore={valore.ore} minuti={valore.minuti} size={48} />
                </div>
                <span className={styles.orologioTasselloDescrizione}>{valore.descrizione}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stato === 'completato' && (
        <div className={styles.orologioSuccesso}>
          <div className={styles.orologioSuccessoIcona}>✅</div>
          <p>Ottimo! Hai completato &quot;{domanda.titolo}&quot;!</p>
        </div>
      )}
    </div>
  )
}

function OrologioGame({ onBack, onStarEarned }: { onBack: () => void; onStarEarned: (chiave: string) => void }) {
  const [fase, setFase] = useState(0)
  const [fasiCompletate, setFasiCompletate] = useState(new Set())
  const [risultatiFasi, setRisultatiFasi] = useState<Map<number, import('../types').RispostaQuiz[]>>(new Map())
  const totaleFasi = orologio.domande.length

  function onCompletato(faseCompletata: number, risultati: import('../types').RispostaQuiz[]) {
    setRisultatiFasi(prev => new Map(prev).set(faseCompletata, risultati))
    setFasiCompletate(prev => new Set([...prev, faseCompletata]))
  }

  function avanzaFase() {
    setFase(prev => prev + 1)
  }

  const tutteCompletate = fasiCompletate.size >= totaleFasi

  const tutteRisultati = Array.from(risultatiFasi.values()).flat()
  const punteggioFinale = tutteRisultati.filter(r => r.corretta).length

  if (tutteCompletate) {
    return (
      <Riepilogo
        icona={orologio.icona}
        nome={orologio.nome}
        colore={orologio.colore}
        punteggio={punteggioFinale}
        totale={tutteRisultati.length}
        risposte={tutteRisultati}
        onBack={onBack}
      />
    )
  }

  return (
    <div className={styles.orologioGame}>
      <div className={styles.orologioHeader}>
        <button className="btn-back" onClick={onBack}>
          ← Indietro
        </button>
        <div className={styles.orologioProgressDots}>
          {orologio.domande.map((d, i) => (
            <span
              key={d.id}
              className={`${styles.orologioDot} ${i === fase ? styles.attivo : ''} ${fasiCompletate.has(i) ? styles.completato : ''}`}
            />
          ))}
        </div>
        <span className={styles.orologioFaseLabel}>{fase + 1}/{totaleFasi}</span>
      </div>

      <FaseGame
        key={fase}
        fase={fase}
        onCompletato={onCompletato}
        onProsegui={(_f, risultati) => { onCompletato(fase, risultati); avanzaFase() }}
        onStarEarned={onStarEarned}
      />
    </div>
  )
}

export default OrologioGame