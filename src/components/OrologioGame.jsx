import { useState, useEffect } from 'react'
import orologio from '../data/orologio'
import { playMp3 } from '../utils/tts'
import ClockIcon from './ClockIcon'

function mischia(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomPreInseriti(totale, conteggio) {
  const indici = Array.from({ length: totale }, (_, i) => i)
  for (let i = indici.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indici[i], indici[j]] = [indici[j], indici[i]]
  }
  return new Set(indici.slice(0, conteggio))
}

function inizializzaFase(fase) {
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

function FaseGame({ fase, onCompletato, onStarEarned }) {
  const init = inizializzaFase(fase)
  const [grid, setGrid] = useState(init.grid)
  const [wallet, setWallet] = useState(init.wallet)
  const [selezionato, setSelezionato] = useState(null)
  const [stato, setStato] = useState('gioco')
  const [slotErrati, setSlotErrati] = useState(new Set())

  const domanda = orologio.domande[fase]
  const audioPath = `${import.meta.env.BASE_URL}assets/audio/giochi/orologio/${domanda.id}.mp3`

  useEffect(() => {
    playMp3(audioPath)
  }, [audioPath])

  function cliccaTassello(indiceWallet) {
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

  function cliccaSlot(indiceSlot) {
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

  function controlla(griglia) {
    const d = orologio.domande[fase]
    const errati = new Set()
    let ok = true
    griglia.forEach((s, i) => {
      if (!s.valore || s.valore.nome !== s.atteso.nome) {
        errati.add(i)
        ok = false
      }
    })

    if (ok) {
      setStato('completato')
      const chiave = `giochi/orologio/${d.id}`
      onStarEarned(chiave)
      onCompletato(fase)
    } else {
      setStato('errato')
      setSlotErrati(errati)
    }
  }

  function handleDragStart(e, sorgente, indice) {
    e.dataTransfer.setData('application/json', JSON.stringify({ sorgente, indice }))
  }

  function handleDragOver(e) {
    if (stato === 'gioco') e.preventDefault()
  }

  function handleDrop(e, indiceSlot) {
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
    <div className="orologio-area">
      <div className="orologio-domanda">
        <span className="orologio-domanda-icona">{orologio.icona}</span>
        <p className="orologio-domanda-testo">
          {domanda.testo}
          <button className="btn-speak" onClick={() => playMp3(audioPath)} aria-label="Ascolta la domanda">
            🔈
          </button>
        </p>
      </div>

      <div
        className="orologio-griglia"
        style={{ '--num-colonne': 4 }}
      >
        {grid.map((slot, i) => (
          <div
            key={i}
            className={`orologio-slot ${
              slot.valore && !slot.bloccato ? 'pieno' : ''
            } ${slot.bloccato ? 'bloccato' : ''} ${
              slot.valore === null && !slot.bloccato ? 'vuoto' : ''
            } ${slotErrati.has(i) ? 'errato' : ''} ${
              selezionato !== null && slot.valore === null && !slot.bloccato ? 'pronto' : ''
            }`}
            onClick={() => cliccaSlot(i)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
          >
            {slot.valore ? (
              <>
                <span className="orologio-slot-valore">
                  <ClockIcon ore={slot.valore.ore} minuti={slot.valore.minuti} size={48} />
                </span>
                <span className="orologio-slot-etichetta">{slot.etichetta}</span>
              </>
            ) : (
              <span className="orologio-slot-etichetta">{slot.etichetta}</span>
            )}
          </div>
        ))}
      </div>

      {stato === 'errato' && (
        <div className="orologio-feedback orologio-feedback-errato">
          ❌ Alcuni tasselli non sono nella posizione giusta. Clicca quelli evidenziati per correggerli.
        </div>
      )}

      {wallet.length > 0 && stato !== 'completato' && (
        <div className="orologio-wallet" onDragOver={handleDragOver}>
          <p className="orologio-wallet-label">Orologi da posizionare:</p>
          <div className="orologio-tasselli">
            {wallet.map((valore, i) => (
              <div className="orologio-tassello-wrapper" key={`${valore.nome}-${i}`}>
                <div
                  className={`orologio-tassello ${selezionato === i ? 'selezionato' : ''}`}
                  draggable={stato === 'gioco'}
                  onClick={() => cliccaTassello(i)}
                  onDragStart={(e) => handleDragStart(e, 'wallet', i)}
                >
                  <ClockIcon ore={valore.ore} minuti={valore.minuti} size={48} />
                </div>
                <span className="orologio-tassello-descrizione">{valore.descrizione}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stato === 'completato' && (
        <div className="orologio-successo">
          <div className="orologio-successo-icona">✅</div>
          <p>Ottimo! Hai completato &quot;{domanda.titolo}&quot;!</p>
        </div>
      )}

      {stato === 'gioco' && wallet.length === 0 && grid.every(s => s.valore !== null) && (
        <div className="orologio-feedback orologio-feedback-corretto">
          ✅ Controllo in corso...
        </div>
      )}
    </div>
  )
}

function OrologioGame({ onBack, onStarEarned }) {
  const [fase, setFase] = useState(0)
  const [stelleFase, setStelleFase] = useState(new Set())
  const totaleFasi = orologio.domande.length

  function onCompletato(faseCompletata) {
    setStelleFase(prev => new Set([...prev, faseCompletata]))
  }

  const tutteCompletate = orologio.domande.every((_, i) => stelleFase.has(i))

  return (
    <div className="orologio-game">
      <div className="orologio-header">
        <button className="btn-back" onClick={onBack}>
          ← Indietro
        </button>
        <div className="orologio-progress-dots">
          {orologio.domande.map((d, i) => (
            <span
              key={d.id}
              className={`orologio-dot ${i === fase ? 'attivo' : ''} ${stelleFase.has(i) ? 'completato' : ''}`}
              onClick={() => setFase(i)}
            />
          ))}
        </div>
        <span className="orologio-fase-label">{fase + 1}/{totaleFasi}</span>
      </div>

      <FaseGame
        key={fase}
        fase={fase}
        onCompletato={onCompletato}
        onStarEarned={onStarEarned}
      />

      {tutteCompletate && (
        <div className="orologio-avanti-container">
          <button
            className="btn-next"
            style={{ background: orologio.colore }}
            onClick={onBack}
          >
            🎉 Visualizza risultati →
          </button>
        </div>
      )}
    </div>
  )
}

export default OrologioGame