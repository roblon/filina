import React, { useState, useEffect } from 'react'
import calendario from '../data/calendario'
import { playMp3 } from '../utils/tts'
import mischia from '../utils/mischia'
import Riepilogo from './Riepilogo'
import styles from './CalendarioGame.module.css'

function randomPreInseriti(totale: number, conteggio: number) {
  const indici = Array.from({ length: totale }, (_, i) => i)
  for (let i = indici.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indici[i], indici[j]] = [indici[j], indici[i]]
  }
  return new Set(indici.slice(0, conteggio))
}

function inizializzaFase(fase: number) {
  const d = calendario.domande[fase]
  const preInseriti = randomPreInseriti(d.tasselli.length, d.preInseriti)
  if (d.tipo === 'ordine') {
    const tasselli = d.tasselli as string[]
    return {
      grid: tasselli.map((t, i) => ({
        etichetta: undefined as string | undefined,
        valore: preInseriti.has(i) ? t : null,
        bloccato: preInseriti.has(i),
        atteso: t,
        indice: i,
      })),
      wallet: mischia(tasselli.filter((_, i) => !preInseriti.has(i))),
    }
  }
  const tasselli = d.tasselli as { nome: string; simbolo: string }[]
  return {
    grid: tasselli.map((t, i) => ({
      etichetta: t.nome,
      valore: preInseriti.has(i) ? t.simbolo : null,
      bloccato: preInseriti.has(i),
      atteso: t.simbolo,
      indice: i,
    })),
    wallet: mischia(tasselli.filter((_, i) => !preInseriti.has(i)).map(t => t.simbolo)),
  }
}

function FaseGame({ fase, onCompletato, onStarEarned }: { fase: number; onCompletato: (fase: number, risultati: import('../types').RispostaQuiz[]) => void; onStarEarned: (key: string) => void }) {
  const init = inizializzaFase(fase)
  const [grid, setGrid] = useState(init.grid)
  const [wallet, setWallet] = useState(init.wallet)
  const [selezionato, setSelezionato] = useState<number | null>(null)
  const [stato, setStato] = useState<'gioco' | 'completato' | 'errato'>('gioco')
  const [slotErrati, setSlotErrati] = useState(new Set<number>())

  const domanda = calendario.domande[fase]
  const abbinamento = domanda.tipo === 'abbinamento'

  const nomePerValore = new Map<string, string>()
  if (abbinamento) {
    for (const slot of grid) {
      nomePerValore.set(slot.atteso, slot.etichetta!)
    }
  }

  const audioPath = `${import.meta.env.BASE_URL}assets/audio/giochi/calendario/${domanda.id}.mp3`

  useEffect(() => {
    playMp3(audioPath)
  }, [audioPath])

  function cliccaTassello(indiceWallet: number) {
    if (stato !== 'gioco') return
    setSelezionato(prev => {
      const nuovoSelezionato = prev === indiceWallet ? null : indiceWallet
      if (nuovoSelezionato !== null) {
        const valore = wallet[nuovoSelezionato]
        const nome = nomePerValore.get(valore) ?? valore
        const tileAudioPath = `${import.meta.env.BASE_URL}assets/audio/giochi/calendario/${nome}.mp3`
        playMp3(tileAudioPath)
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

  function controlla(griglia: { valore: string | null; bloccato: boolean; atteso: string; indice: number; etichetta?: string }[]) {
    const d = calendario.domande[fase]
    const errati = new Set<number>()
    let ok = true
    griglia.forEach((s, i) => {
      if (s.valore !== s.atteso) {
        errati.add(i)
        ok = false
      }
    })

    if (ok) {
      setStato('completato')
      const chiave = `giochi/calendario/${d.id}`
      onStarEarned(chiave)
      const risultati: import('../types').RispostaQuiz[] = griglia.map(s => ({
        domanda: s.etichetta ?? s.atteso,
        corretta: true,
        rispostaCorretta: s.atteso,
        rispostaData: s.valore!,
      }))
      onCompletato(fase, risultati)
    } else {
      setStato('errato')
      setSlotErrati(errati)
    }
  }

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, sorgente: string, indice: number) {
    e.dataTransfer.setData('application/json', JSON.stringify({ sorgente, indice }))
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    if (stato === 'gioco') e.preventDefault()
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, indiceSlot: number) {
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

  const numColonne = abbinamento ? 4 : grid.length <= 4 ? grid.length : grid.length <= 7 ? 4 : 4

  return (
    <div className={styles.calendarioArea}>
      <div className={styles.calendarioDomanda}>
        <span className={styles.calendarioDomandaIcona}>{calendario.icona}</span>
        <p className={styles.calendarioDomandaTesto}>
          {domanda.testo}
          <button className="btn-speak" onClick={() => playMp3(audioPath)} aria-label="Ascolta la domanda">
            🔈
          </button>
        </p>
      </div>

      <div
        className={`${styles.calendarioGriglia}${abbinamento ? ` ${styles.calendarioGrigliaAbbinamento}` : ''}`}
        style={{ '--num-colonne': numColonne } as React.CSSProperties}
      >
        {grid.map((slot, i) => (
          <div
            key={i}
            className={`${styles.calendarioSlot}${
              slot.valore && !slot.bloccato ? ` ${styles.pieno}` : ''
            }${slot.bloccato ? ` ${styles.bloccato}` : ''}${
              slot.valore === null && !slot.bloccato ? ` ${styles.vuoto}` : ''
            }${slotErrati.has(i) ? ` ${styles.errato}` : ''}${
              selezionato !== null && slot.valore === null && !slot.bloccato ? ` ${styles.pronto}` : ''
            }`}
            onClick={() => cliccaSlot(i)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
          >
            {slot.valore ? (
              abbinamento ? (
                <>
                  <span className={styles.calendarioSlotValore}>{slot.valore}</span>
                  <span className={styles.calendarioSlotEtichetta}>{slot.etichetta}</span>
                </>
              ) : (
                <span className={styles.calendarioSlotValore}>{slot.valore}</span>
              )
            ) : abbinamento ? (
              <span className={styles.calendarioSlotPlaceholder}>{slot.etichetta}</span>
            ) : (
              <span className={styles.calendarioSlotPlaceholder}>{i + 1}</span>
            )}
          </div>
        ))}
      </div>

      {stato === 'errato' && (
        <div className={`${styles.calendarioFeedback} ${styles.calendarioFeedbackErrato}`}>
          ❌ Alcuni tasselli non sono nella posizione giusta. Clicca quelli evidenziati per correggerli.
        </div>
      )}

      {wallet.length > 0 && stato !== 'completato' && (
        <div className={styles.calendarioWallet} onDragOver={handleDragOver}>
          <p className={styles.calendarioWalletLabel}>Tasselli da posizionare:</p>
          <div className={styles.calendarioTasselli}>
            {wallet.map((valore, i) => (
              <div
                key={`${valore}-${i}`}
                className={`${styles.calendarioTassello}${selezionato === i ? ` ${styles.selezionato}` : ''}`}
                draggable={stato === 'gioco'}
                onClick={() => cliccaTassello(i)}
                onDragStart={(e) => handleDragStart(e, 'wallet', i)}
              >
                {valore}
              </div>
            ))}
          </div>
        </div>
      )}

      {stato === 'completato' && (
        <div className={styles.calendarioSuccesso}>
          <div className={styles.calendarioSuccessoIcona}>✅</div>
          <p>Ottimo! Hai completato &quot;{domanda.titolo}&quot;!</p>
        </div>
      )}

      {stato === 'gioco' && wallet.length === 0 && grid.every(s => s.valore !== null) && (
        <div className={`${styles.calendarioFeedback} ${styles.calendarioFeedbackCorretto}`}>
          ✅ Controllo in corso...
        </div>
      )}
    </div>
  )
}

function CalendarioGame({ onBack, onStarEarned }: { onBack: () => void; onStarEarned: (key: string) => void }) {
  const [fase, setFase] = useState(0)
  const [stelleFase, setStelleFase] = useState(new Set())
  const [risultatiFasi, setRisultatiFasi] = useState<Map<number, import('../types').RispostaQuiz[]>>(new Map())
  const totaleFasi = calendario.domande.length

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

  const tutteCompletate = calendario.domande.every((_, i) => stelleFase.has(i))

  const tutteRisultati = Array.from(risultatiFasi.values()).flat()
  const punteggioFinale = tutteRisultati.filter(r => r.corretta).length

  if (tutteCompletate) {
    return (
      <Riepilogo
        icona={calendario.icona}
        nome={calendario.nome}
        colore={calendario.colore}
        punteggio={punteggioFinale}
        totale={tutteRisultati.length}
        risposte={tutteRisultati}
        onBack={onBack}
      />
    )
  }

  return (
    <div className={styles.calendarioGame}>
      <div className={styles.calendarioHeader}>
        <button className="btn-back" onClick={onBack}>
          ← Indietro
        </button>
        <div className={styles.calendarioProgressDots}>
          {calendario.domande.map((d, i) => (
            <span
              key={d.id}
              className={`${styles.calendarioDot}${i === fase ? ` ${styles.attivo}` : ''}${stelleFase.has(i) ? ` ${styles.completato}` : ''}`}
              onClick={() => vaiFase(i)}
            />
          ))}
        </div>
        <span className={styles.calendarioFaseLabel}>{fase + 1}/{totaleFasi}</span>
      </div>

      <FaseGame
        key={fase}
        fase={fase}
        onCompletato={onCompletato}
        onStarEarned={onStarEarned}
      />

      {!tutteCompletate && (
        <div className={styles.calendarioNavContainer}>
          <button
            className={styles.calendarioNavBtn}
            disabled={fase === 0}
            onClick={fasePrecedente}
          >
            ← Precedente
          </button>
          <span className={styles.calendarioNavCounter}>{fase + 1} / {totaleFasi}</span>
          <button
            className={styles.calendarioNavBtn}
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

export default CalendarioGame
