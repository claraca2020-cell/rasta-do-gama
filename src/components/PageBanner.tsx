import arquibancada from '../assets/photos/arquibancada-norte.webp'

// Banner das páginas internas: foto da arquibancada escurecida com título grande centralizado.
export function PageBanner({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-black)] text-white">
      <img src={arquibancada} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-black)]/40 to-[var(--color-black)]/85" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[200px] max-w-[1100px] flex-col items-center justify-center px-5 py-10 text-center md:min-h-[260px]">
        {kicker && <p className="eyebrow text-[var(--color-sun)]">{kicker}</p>}
        <h1 className="heading title-rule mt-3 text-5xl md:text-7xl">{title}</h1>
      </div>
    </section>
  )
}
