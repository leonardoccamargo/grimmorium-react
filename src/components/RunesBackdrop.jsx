export default function RunesBackdrop() {
  return (
    <div className="home-runes-backdrop" aria-hidden="true">
      <div className="home-rune home-rune-left"><RuneCircle large /></div>
      <div className="home-rune home-rune-right"><RuneCircle large /></div>
    </div>
  )
}

function RuneCircle({ large = false }) {
  const size = large ? 600 : 180

  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <polygon points="100,25 165,140 35,140" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <polygon points="100,175 35,60 165,60" fill="none" stroke="currentColor" strokeWidth="0.5" />
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2
        const x1 = 100 + Math.cos(angle) * 82
        const y1 = 100 + Math.sin(angle) * 82
        const x2 = 100 + Math.cos(angle) * 90
        const y2 = 100 + Math.sin(angle) * 90
        return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.6" />
      })}
    </svg>
  )
}