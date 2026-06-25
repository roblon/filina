function StarsCounter({ count }) {
  return (
    <div className="stars-counter" key={count}>
      <span className="stars-icon">⭐</span>
      <span className="stars-count">{count}</span>
    </div>
  )
}

export default StarsCounter
