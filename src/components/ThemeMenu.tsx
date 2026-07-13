import styles from './ThemeMenu.module.css'

interface ThemeMenuProps {
  onSelectTema: (id: string) => void
}

const temi = [
  { id: 'giochi', nome: 'Vocabolario', descrizione: 'Impara le parole con quiz interattivi', icona: '📖', colore: '#FF6B6B' },
  { id: 'esercizi', nome: 'Grammatica', descrizione: 'Allenati con la grammatica', icona: '✍️', colore: '#4ECDC4' },
  { id: 'storie', nome: 'Storie', descrizione: 'Leggi e ascolta brevi storie in italiano', icona: '📖', colore: '#A66CFF' },
]

function ThemeMenu({ onSelectTema }: ThemeMenuProps) {
  return (
    <div className={styles.menu}>
      <div className={styles.menuHeader}>
        <span className={styles.menuLogo}>🎮</span>
        <h1>Filina</h1>
        <p className={styles.menuSubtitle}>Impara l'Italiano</p>
      </div>
      <div className={styles.menuGrid}>
        {temi.map((tema) => (
          <button
            key={tema.id}
            className={styles.menuCard}
            style={{ '--tema-color': tema.colore } as React.CSSProperties}
            onClick={() => onSelectTema(tema.id)}
          >
            <span className={styles.menuCardIcona}>{tema.icona}</span>
            <span className={styles.menuCardNome}>{tema.nome}</span>
            <span className={styles.menuCardDesc}>{tema.descrizione}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ThemeMenu
