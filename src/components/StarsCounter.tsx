import styles from './StarsCounter.module.css'

interface StarsCounterProps {
  count: number
  onClick: () => void
}

function StarsCounter({ count, onClick }: StarsCounterProps) {
  return (
    <button className={styles.starsCounter} key={count} onClick={onClick}>
      <span className={styles.starsIcon}>⭐</span>
      <span className={styles.starsCount}>{count}</span>
    </button>
  )
}

export default StarsCounter
