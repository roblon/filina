import styles from './Placeholder.module.css'

const info: Record<string, { icona: string; titolo: string; testo: string }> = {
  storie: { icona: '📖', titolo: 'Storie', testo: 'Presto disponibile! Brevi storie in italiano per migliorare la lettura e la comprensione.' },
}

interface PlaceholderProps {
  tema: string
  onBackToMenu: () => void
}

function Placeholder({ tema, onBackToMenu }: PlaceholderProps) {
  const dati = info[tema] || { icona: '', titolo: '', testo: '' }
  return (
    <div className={styles.placeholderScreen}>
      <div className={styles.placeholderCard}>
        <span className={styles.placeholderIcona}>{dati.icona}</span>
        <h2>{dati.titolo}</h2>
        <p>{dati.testo}</p>
        <button className="btn btn-riprova" onClick={onBackToMenu}>
          🔙 Torna al menu
        </button>
      </div>
    </div>
  )
}

export default Placeholder
