import { useState } from 'react'
import { getSezioni, getTotalePossibile, getChiaviGuadagnate, resettaStelle } from '../utils/stelle'

function StarsModal({ onClose, onReset }) {
  const [sezioni, setSezioni] = useState(getSezioni())
  const [sezioneSelezionata, setSezioneSelezionata] = useState(null)
  const totali = getChiaviGuadagnate().length
  const possibili = getTotalePossibile()

  function handleReset() {
    resettaStelle()
    setSezioni(getSezioni())
    setSezioneSelezionata(null)
    onReset?.()
  }

  // se una sezione è selezionata, mostra i suoi moduli
  if (sezioneSelezionata) {
    const sezione = sezioni.find((s) => s.id === sezioneSelezionata.id) || sezioneSelezionata
    const sOttenute = sezione.moduli.reduce((s, m) => s + m.ottenute, 0)
    const sTotale = sezione.moduli.reduce((s, m) => s + m.totale, 0)

    return (
      <div className="stars-modal-overlay" onClick={onClose}>
        <div className="stars-modal" onClick={(e) => e.stopPropagation()}>
          <button className="stars-modal-close" onClick={onClose}>✕</button>
          <button
            className="stars-modal-back"
            onClick={() => setSezioneSelezionata(null)}
          >
            ← Indietro
          </button>
          <h2 className="stars-modal-title">
            {sezione.icona} {sezione.nome}
          </h2>
          <div className="stars-modal-total">
            {sOttenute} / {sTotale}
          </div>
          <div className="stars-modal-lista">
            {(() => {
              const hasLevels = sezione.moduli.some((m) => m.livello != null)
              if (!hasLevels) {
                return sezione.moduli.map((m) => (
                  <div key={m.id} className="stars-modal-riga">
                    <span className="stars-modal-riga-icona">{m.icona}</span>
                    <span className="stars-modal-riga-nome">{m.nome}</span>
                    <div className="stars-modal-riga-bar">
                      <div
                        className="stars-modal-riga-fill"
                        style={{
                          width: `${Math.min(100, (m.ottenute / m.totale) * 100)}%`,
                          backgroundColor: m.colore,
                        }}
                      />
                    </div>
                    <span className="stars-modal-riga-conteggio">
                      {m.ottenute}/{m.totale}
                    </span>
                  </div>
                ))
              }

              const livelli = []
              for (const m of sezione.moduli) {
                const lv = m.livello || 1
                let gruppo = livelli.find((g) => g.lv === lv)
                if (!gruppo) {
                  gruppo = { lv, moduli: [] }
                  livelli.push(gruppo)
                }
                gruppo.moduli.push(m)
              }

              return livelli.map((g, i) => (
                <div key={g.lv} className="stars-level-group">
                  {i > 0 && <div className="stars-level-divider" />}
                  <div className="stars-level-label">Livello {g.lv}</div>
                  {g.moduli.map((m) => (
                    <div key={m.id} className="stars-modal-riga">
                      <span className="stars-modal-riga-icona">{m.icona}</span>
                      <span className="stars-modal-riga-nome">{m.nome}</span>
                      <div className="stars-modal-riga-bar">
                        <div
                          className="stars-modal-riga-fill"
                          style={{
                            width: `${Math.min(100, (m.ottenute / m.totale) * 100)}%`,
                            backgroundColor: m.colore,
                          }}
                        />
                      </div>
                      <span className="stars-modal-riga-conteggio">
                        {m.ottenute}/{m.totale}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            })()}
          </div>
          <button className="btn-reset-stars" onClick={handleReset}>
            🗑️ Azzera tutte le stelle
          </button>
        </div>
      </div>
    )
  }

  // vista sezioni
  return (
    <div className="stars-modal-overlay" onClick={onClose}>
      <div className="stars-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stars-modal-close" onClick={onClose}>✕</button>
        <h2 className="stars-modal-title">⭐ Le tue stelle</h2>
        <div className="stars-modal-total">
          {totali} / {possibili}
        </div>
        <div className="stars-modal-lista">
          {sezioni.map((s) => {
            const sOttenute = s.moduli.reduce((sum, m) => sum + m.ottenute, 0)
            const sTotale = s.moduli.reduce((sum, m) => sum + m.totale, 0)
            return (
              <button
                key={s.id}
                className="stars-section-card"
                onClick={() => setSezioneSelezionata(s)}
              >
                <div className="stars-section-left">
                  <span className="stars-section-icona">{s.icona}</span>
                  <span className="stars-section-nome">{s.nome}</span>
                </div>
                <div className="stars-section-right">
                  <div className="stars-section-bar">
                    <div
                      className="stars-section-fill"
                      style={{
                        width: `${Math.min(100, (sOttenute / sTotale) * 100)}%`,
                        backgroundColor: s.colore,
                      }}
                    />
                  </div>
                  <span className="stars-section-conteggio">
                    {sOttenute}/{sTotale}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
        <button className="btn-reset-stars" onClick={handleReset}>
          🗑️ Azzera tutte le stelle
        </button>
      </div>
    </div>
  )
}

export default StarsModal
