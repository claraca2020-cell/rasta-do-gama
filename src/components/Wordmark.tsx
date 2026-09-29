import logoPapagaio from '../assets/brand/logo-papagaio-sm.webp'

// Marca: logo do papagaio rasta (vault "17,5 RASTA/logo do papagaio", fundo removido) + nome em pincel.
export function Wordmark({ className = '', logoClassName = 'h-14 md:h-[68px]', hideTextOnMobile = false }: { className?: string; logoClassName?: string; hideTextOnMobile?: boolean }) {
  return (
    <span className={`flex items-center gap-2.5 text-white ${className}`}>
      <img src={logoPapagaio} alt={hideTextOnMobile ? 'Rasta do Gama — página inicial' : ''} width={166} height={180} className={`w-auto drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] ${logoClassName}`} />
      <span className={`flex-col leading-none ${hideTextOnMobile ? 'hidden sm:flex' : 'flex'}`}>
        <span className="brush whitespace-nowrap text-[1.3rem] md:text-[1.65rem]">Rasta do Gama</span>
        <span className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.3em] text-[var(--color-sun)] md:text-[0.6rem]">Movimento popular</span>
      </span>
    </span>
  )
}
