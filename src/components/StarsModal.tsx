import { useState } from 'react'
import { getSezioni, getTotalePossibile, getChiaviGuadagnate, resettaStelle } from '../utils/stelle'
import type { SezioneStelle, ModuloStelle } from '../types'
import styles from './StarsModal.module.css'

interface StarsModalProps {
  onClose: () => void
  onReset?: () => void
}

function StarsModal({ onClose, onReset }: StarsModalProps) {
  const [sezioni, setSezioni] = useState<SezioneStelle[]>(getSezioni())
  const [sezioneSelezionata, setSezioneSelezionata] = useState<SezioneStelle | null>(null)
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
    const sOttenute = sezione.moduli.reduce((s, m) => s + (m.ottenute ?? 0), 0)
    const sTotale = sezione.moduli.reduce((s, m) => s + m.totale, 0)

    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.close} onClick={onClose}>✕</button>
          <button
            className={styles.back}
            onClick={() => setSezioneSelezionata(null)}
          >
            ← Indietro
          </button>
          <h2 className={styles.title}>
            {sezione.icona} {sezione.nome}
          </h2>
          <div className={styles.total}>
            {sOttenute} / {sTotale}
          </div>
          <div className={styles.lista}>
            {(() => {
              const hasLevels = sezione.moduli.some((m) => m.livello != null)
              if (!hasLevels) {
                return sezione.moduli.map((m) => (
                  <div key={m.id} className={styles.riga}>
                    <span className={styles.rigaIcona}>{m.icona}</span>
                    <span className={styles.rigaNome}>{m.nome}</span>
                    <div className={styles.rigaBar}>
                      <div
                        className={styles.rigaFill}
                        style={{
                          width: `${Math.min(100, ((m.ottenute ?? 0) / m.totale) * 100)}%`,
                          backgroundColor: m.colore,
                        }}
                      />
                    </div>
                    <span className={styles.rigaConteggio}>
                      {m.ottenute ?? 0}/{m.totale}
                    </span>
                  </div>
                ))
              }

              const livelli: { lv: number; moduli: ModuloStelle[] }[] = []
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
                <div key={g.lv} className={styles.levelGroup}>
                  {i > 0 && <div className={styles.levelDivider} />}
                  <div className={styles.levelLabel}>Livello {g.lv}</div>
                  {g.moduli.map((m) => (
                    <div key={m.id} className={styles.riga}>
                      <span className={styles.rigaIcona}>{m.icona}</span>
                      <span className={styles.rigaNome}>{m.nome}</span>
                      <div className={styles.rigaBar}>
                        <div
                          className={styles.rigaFill}
                          style={{
                            width: `${Math.min(100, ((m.ottenute ?? 0) / m.totale) * 100)}%`,
                            backgroundColor: m.colore,
                          }}
                        />
                      </div>
                      <span className={styles.rigaConteggio}>
                        {m.ottenute ?? 0}/{m.totale}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            })()}
          </div>
          <button className={styles.btnReset} onClick={handleReset}>
            🗑️ Azzera tutte le stelle
          </button>
        </div>
      </div>
    )
  }

  // vista sezioni
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <h2 className={styles.title}>⭐ Le tue stelle</h2>
        <div className={styles.total}>
          {totali} / {possibili}
        </div>
        <div className={styles.lista}>
          {sezioni.map((s) => {
            const sOttenute = s.moduli.reduce((sum, m) => sum + (m.ottenute ?? 0), 0)
            const sTotale = s.moduli.reduce((sum, m) => sum + m.totale, 0)
            return (
              <button
                key={s.id}
                className={styles.sectionCard}
                onClick={() => setSezioneSelezionata(s)}
              >
                <div className={styles.sectionLeft}>
                  <span className={styles.sectionIcona}>{s.icona}</span>
                  <span className={styles.sectionNome}>{s.nome}</span>
                </div>
                <div className={styles.sectionRight}>
                  <div className={styles.sectionBar}>
                    <div
                      className={styles.sectionFill}
                      style={{
                        width: `${Math.min(100, (sOttenute / sTotale) * 100)}%`,
                        backgroundColor: s.colore,
                      }}
                    />
                  </div>
                  <span className={styles.sectionConteggio}>
                    {sOttenute}/{sTotale}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
        <button className={styles.btnReset} onClick={handleReset}>
          🗑️ Azzera tutte le stelle
        </button>
      </div>
    </div>
  )
}

export default StarsModal
