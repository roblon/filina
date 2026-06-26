function StarsCounter({ count, onClick }) {
  return (
    <button className="stars-counter" key={count} onClick={onClick}>
      <span className="stars-icon">⭐</span>
      <span className="stars-count">{count}</span>
    </button>
  )
}

export default StarsCounter
