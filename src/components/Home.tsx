import type { CategoriaEsercizio } from '../types'
import styles from './Home.module.css'

interface HomeProps {
  categorie: CategoriaEsercizio[]
  onStart: (cat: CategoriaEsercizio) => void
  onBackToMenu: () => void
  icona?: string
  titolo?: string
  sottotitolo?: string
}

function Home({ onStart, onBackToMenu, categorie: categorieProp, icona, titolo, sottotitolo }: HomeProps) {
  const categorie = categorieProp || []
  const hasLevels = categorie.some((c) => c.livello != null)

  function renderGriglia(items: CategoriaEsercizio[]) {
    return (
      <div className={styles.categorieGrid}>
        {items.map((cat) => (
          <button
            key={cat.id}
            className={styles.categoriaCard}
            style={{ '--cat-color': cat.colore } as React.CSSProperties}
            onClick={() => onStart(cat)}
          >
            <span className={styles.categoriaIcona}>{cat.icona}</span>
            <span className={styles.categoriaNome}>{cat.nome}</span>
          </button>
        ))}
      </div>
    )
  }

  if (hasLevels) {
    const livelli: { lv: number; categorie: CategoriaEsercizio[] }[] = []
    for (const c of categorie) {
      const lv = c.livello || 1
      let gruppo = livelli.find((g) => g.lv === lv)
      if (!gruppo) {
        gruppo = { lv, categorie: [] }
        livelli.push(gruppo)
      }
      gruppo.categorie.push(c)
    }

    return (
      <div className={styles.home}>
        <div className={styles.homeHeader}>
          <button className={`btn-back ${styles.menuBtn}`} onClick={onBackToMenu}>
            ← Menu
          </button>
          <span className={styles.homeIcon}>{icona || '🎮'}</span>
          <h1>{titolo || 'Filina - Impara L\'Italiano'}</h1>
          <p>{sottotitolo || 'Scegli un argomento per iniziare a giocare'}</p>
        </div>
        {livelli.map((g, i) => (
          <div key={g.lv} className={styles.homeLevelGroup}>
            {i > 0 && <div className={styles.homeLevelDivider} />}
            <div className={styles.homeLevelLabel}>Livello {g.lv}</div>
            {renderGriglia(g.categorie)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.home}>
      <div className={styles.homeHeader}>
        <button className={`btn-back ${styles.menuBtn}`} onClick={onBackToMenu}>
          ← Menu
        </button>
        <span className={styles.homeIcon}>{icona || '🎮'}</span>
        <h1>{titolo || 'Filina - Impara L\'Italiano'}</h1>
        <p>{sottotitolo || 'Scegli un argomento per iniziare a giocare'}</p>
      </div>
      {renderGriglia(categorie)}
    </div>
  )
}

export default Home
