// Elementos gráficos próprios (desenhados em código): borda rasgada e silhueta de arquibancada.

const TORN =
  'M0,18 L40,26 L78,14 L120,30 L160,16 L205,28 L240,12 L290,24 L330,10 L372,27 L415,15 L460,29 L500,13 L548,25 L590,11 L636,28 L680,17 L722,31 L765,14 L810,26 L852,12 L900,27 L944,15 L985,30 L1030,13 L1075,25 L1118,11 L1160,28 L1205,16 L1250,29 L1292,12 L1336,24 L1380,14 L1440,22 L1440,40 L0,40 Z'

export function TornEdge({ className = '', color = 'var(--color-bg-main)' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true" className={`block h-6 w-full md:h-10 ${className}`}>
      <path d={TORN} fill={color} />
    </svg>
  )
}

// Silhueta de torcida (braços, bandeiras e mastros) gerada de forma determinística.
function crowdPath() {
  const width = 1440
  const base = 70
  let d = `M0,${base}`
  for (let x = 0; x <= width; x += 12) {
    const h = 18 + Math.abs(Math.sin(x * 0.037) * 16) + Math.abs(Math.sin(x * 0.11) * 10)
    d += ` L${x},${base - h} L${x + 5},${base - h - 6} L${x + 8},${base - h + 4}`
    if (x % 156 === 0) d += ` L${x + 9},8 L${x + 34},14 L${x + 11},22 L${x + 11},${base - h}`
  }
  return `${d} L${width},${base} L${width},90 L0,90 Z`
}

const CROWD = crowdPath()

export function CrowdEdge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" className={`block h-12 w-full md:h-20 ${className}`}>
      <path d={CROWD} fill="var(--color-black)" />
    </svg>
  )
}

export function Watermark({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <span aria-hidden="true" className={`watermark ${dark ? 'watermark-on-dark' : ''} pointer-events-none absolute -top-8 left-0 select-none whitespace-nowrap md:-top-14`}>
      {children}
    </span>
  )
}
