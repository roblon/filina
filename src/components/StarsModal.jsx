import { useState } from 'react'
import { getStatisticheModuli, getTotalePossibile, getChiaviGuadagnate, resettaStelle } from '../utils/stelle'

function StarsModal({ onClose, onReset }) {
  const [stats, setStats] = useState(getStatisticheModuli())
  const [totali, setTotali] = useState(getChiaviGuadagnate().length)
  const possibili = getTotalePossibile()

  function handleReset() {
    resettaStelle()
    setStats(getStatisticheModuli())
    setTotali(0)
    onReset?.()
  }

  return (
    <div className="stars-modal-overlay" onClick={onClose}>
      <div className="stars-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stars-modal-close" onClick={onClose}>✕</button>
        <h2 className="stars-modal-title">⭐ Le tue stelle</h2>
        <div className="stars-modal-total">
          {totali} / {possibili}
        </div>
        <div className="stars-modal-lista">
          {stats.map((m) => (
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
        <button className="btn-reset-stars" onClick={handleReset}>
          🗑️ Azzera tutte le stelle
        </button>
      </div>
    </div>
  )
}

export default StarsModal
