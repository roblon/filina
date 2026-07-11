function ClockIcon({ ore, minuti, size = 48 }) {
  const raggio = size / 2
  const centro = raggio

  const angoloOre = ((ore % 12) + minuti / 60) * 30
  const angoloMinuti = minuti * 6

  const lunghezzaLancettaOre = raggio * 0.5
  const lunghezzaLancettaMinuti = raggio * 0.75
  const spessoreLancettaOre = Math.max(2, size * 0.06)
  const spessoreLancettaMinuti = Math.max(1.5, size * 0.04)

  function coordLancetta(angolo, lunghezza) {
    const rad = ((angolo - 90) * Math.PI) / 180
    return {
      x: centro + lunghezza * Math.cos(rad),
      y: centro + lunghezza * Math.sin(rad),
    }
  }

  const puntaOre = coordLancetta(angoloOre, lunghezzaLancettaOre)
  const puntaMinuti = coordLancetta(angoloMinuti, lunghezzaLancettaMinuti)

  const tacche = Array.from({ length: 12 }, (_, i) => {
    const angolo = i * 30
    const rad = ((angolo - 90) * Math.PI) / 180
    const èPrincipale = i % 3 === 0
    const rInterno = raggio * (èPrincipale ? 0.82 : 0.88)
    const rEsterno = raggio * 0.95
    return {
      x1: centro + rInterno * Math.cos(rad),
      y1: centro + rInterno * Math.sin(rad),
      x2: centro + rEsterno * Math.cos(rad),
      y2: centro + rEsterno * Math.sin(rad),
      spessore: èPrincipale ? Math.max(1.5, size * 0.035) : Math.max(1, size * 0.02),
    }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={centro} cy={centro} r={raggio - 1} fill="white" stroke="#2d3436" strokeWidth={Math.max(1.5, size * 0.04)} />
      {tacche.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke="#2d3436"
          strokeWidth={t.spessore}
          strokeLinecap="round"
        />
      ))}
      <line
        x1={centro} y1={centro}
        x2={puntaOre.x} y2={puntaOre.y}
        stroke="#2d3436"
        strokeWidth={spessoreLancettaOre}
        strokeLinecap="round"
      />
      <line
        x1={centro} y1={centro}
        x2={puntaMinuti.x} y2={puntaMinuti.y}
        stroke="#d63031"
        strokeWidth={spessoreLancettaMinuti}
        strokeLinecap="round"
      />
      <circle cx={centro} cy={centro} r={Math.max(2, size * 0.05)} fill="#2d3436" />
    </svg>
  )
}

export default ClockIcon
