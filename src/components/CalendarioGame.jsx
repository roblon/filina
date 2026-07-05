import { useState } from 'react'
import calendario from '../data/calendario'

function mischia(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function inizializzaFase(fase) {
  const d = calendario.domande[fase]
  if (d.tipo === 'ordine') {
    return {
      grid: d.tasselli.map((t, i) => ({
        valore: d.preInseriti.includes(i) ? t : null,
        bloccato: d.preInseriti.includes(i),
        atteso: t,
        indice: i,
      })),
      wallet: mischia(d.tasselli.filter((_, i) => !d.preInseriti.includes(i))),
    }
  }
  return {
    grid: d.tasselli.map((t, i) => ({
      etichetta: t.nome,
      valore: d.preInseriti.includes(i) ? t.simbolo : null,
      bloccato: d.preInseriti.includes(i),
      atteso: t.simbolo,
      indice: i,
    })),
    wallet: mischia(d.tasselli.filter((_, i) => !d.preInseriti.includes(i)).map(t => t.simbolo)),
  }
}

function FaseGame({ fase, onCompletato, onStarEarned }) {
  const init = inizializzaFase(fase)
  const [grid, setGrid] = useState(init.grid)
  const [wallet, setWallet] = useState(init.wallet)
  const [selezionato, setSelezionato] = useState(null)
  const [stato, setStato] = useState('gioco')
  const [slotErrati, setSlotErrati] = useState(new Set())

  const domanda = calendario.domande[fase]
  const abbinamento = domanda.tipo === 'abbinamento'

  function cliccaTassello(indiceWallet) {
    if (stato !== 'gioco') return
    setSelezionato(prev => prev === indiceWallet ? null : indiceWallet)
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
    const d = calendario.domande[fase]
    const errati = new Set()
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

  const numColonne = abbinamento ? 4 : grid.length <= 4 ? grid.length : grid.length <= 7 ? 4 : 4

  return (
    <div className="calendario-area">
      <div className="calendario-domanda">
        <span className="calendario-domanda-icona">{calendario.icona}</span>
        <p className="calendario-domanda-testo">{domanda.testo}</p>
      </div>

      <div
        className="calendario-griglia"
        style={{ '--num-colonne': numColonne }}
      >
        {grid.map((slot, i) => (
          <div
            key={i}
            className={`calendario-slot ${
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
              abbinamento ? (
                <>
                  <span className="calendario-slot-valore">{slot.valore}</span>
                  <span className="calendario-slot-etichetta">{slot.etichetta}</span>
                </>
              ) : (
                <span className="calendario-slot-valore">{slot.valore}</span>
              )
            ) : abbinamento ? (
              <span className="calendario-slot-placeholder">{slot.etichetta}</span>
            ) : (
              <span className="calendario-slot-placeholder">{i + 1}</span>
            )}
          </div>
        ))}
      </div>

      {stato === 'errato' && (
        <div className="calendario-feedback calendario-feedback-errato">
          ❌ Alcuni tasselli non sono nella posizione giusta. Clicca quelli evidenziati per correggerli.
        </div>
      )}

      {wallet.length > 0 && stato !== 'completato' && (
        <div className="calendario-wallet" onDragOver={handleDragOver}>
          <p className="calendario-wallet-label">Tasselli da posizionare:</p>
          <div className="calendario-tasselli">
            {wallet.map((valore, i) => (
              <div
                key={`${valore}-${i}`}
                className={`calendario-tassello ${selezionato === i ? 'selezionato' : ''}`}
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
        <div className="calendario-successo">
          <div className="calendario-successo-icona">✅</div>
          <p>Ottimo! Hai completato &quot;{domanda.titolo}&quot;!</p>
        </div>
      )}

      {stato === 'gioco' && wallet.length === 0 && grid.every(s => s.valore !== null) && (
        <div className="calendario-feedback calendario-feedback-corretto">
          ✅ Controllo in corso...
        </div>
      )}
    </div>
  )
}

function CalendarioGame({ onBack, onStarEarned }) {
  const [fase, setFase] = useState(0)
  const [stelleFase, setStelleFase] = useState(new Set())
  const totaleFasi = calendario.domande.length

  function onCompletato(faseCompletata) {
    setStelleFase(prev => new Set([...prev, faseCompletata]))
  }

  function prossimaFase() {
    if (fase + 1 >= totaleFasi) {
      setStato('finito')
    } else {
      setFase(prev => prev + 1)
    }
  }

  const [statoGlobale, setStato] = useState('gioco')

  if (statoGlobale === 'finito') {
    return (
      <div className="calendario-game">
        <div className="calendario-completato">
          <div className="calendario-completato-icona">🎉</div>
          <h2>Complimenti!</h2>
          <p>Hai completato tutti i moduli del Calendario!</p>
          <div className="calendario-stelle-riepilogo">
            {calendario.domande.map((d, i) => (
              <span key={d.id} className={`calendario-riepilogo-stella ${stelleFase.has(i) ? 'piena' : 'vuota'}`}>
                {stelleFase.has(i) ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <button className="btn btn-riprova" onClick={onBack}>
            ← Torna al vocabolario
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="calendario-game">
      <div className="calendario-header">
        <button className="btn-back" onClick={onBack}>
          ← Indietro
        </button>
        <div className="calendario-progress-dots">
          {calendario.domande.map((d, i) => (
            <span
              key={d.id}
              className={`calendario-dot ${i === fase ? 'attivo' : ''} ${stelleFase.has(i) ? 'completato' : ''}`}
            />
          ))}
        </div>
        <span className="calendario-fase-label">{fase + 1}/{totaleFasi}</span>
      </div>

      <FaseGame
        key={fase}
        fase={fase}
        onCompletato={onCompletato}
        onStarEarned={onStarEarned}
      />

      {stelleFase.has(fase) && (
        <div className="calendario-avanti-container">
          <button
            className="btn-next"
            style={{ background: calendario.colore }}
            onClick={prossimaFase}
          >
            {fase + 1 < totaleFasi ? 'Prossima domanda →' : 'Visualizza risultati →'}
          </button>
        </div>
      )}
    </div>
  )
}

export default CalendarioGame
