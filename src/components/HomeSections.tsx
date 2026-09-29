import logoAudity from '../assets/partners/audity.webp'
import logoGuaronha from '../assets/partners/bonde-guaronha.webp'
import logoHonda from '../assets/partners/dr-honda.webp'
import logoGamaStickers from '../assets/partners/gama-stickers.webp'
import logoPlanaltour from '../assets/partners/planaltour.webp'
import logoSebo from '../assets/partners/sebo-do-gama.webp'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, HandHeart, Shirt, Volume2, VolumeX } from 'lucide-react'
import logoPapagaio from '../assets/brand/logo-papagaio.webp'
import arquibancada from '../assets/photos/arquibancada-norte.webp'
import heroAlgodao from '../assets/photos/hero-algodao-doce-sm.webp'
import heroBandeira from '../assets/photos/hero-bandeira-sm.webp'
import heroLanches from '../assets/photos/hero-lanches-sm.webp'
import socialBandeira from '../assets/photos/social-bandeira-rasta.webp'
import socialLembrancinhas from '../assets/photos/social-lembrancinhas.webp'
import socialUpa from '../assets/photos/social-upa.webp'
import { PRODUCTS, formatPrice, type Product } from '../data/products'
import { trackEvent } from '../lib/analytics'
import { whatsappLink } from '../lib/contact'
import { Link } from '../lib/Link'
import { Watermark } from './Decor'
import { ProductCard } from './ProductCard'

/* ---------- Banner: 3 fotos passando a cada 4 s, com transição longa e suave ---------- */
// pan: direção do movimento lento de cada foto (alterna para dar sensação de câmera andando)
// Fotos em /public/hero. Computador/tablet: foto horizontal (900/1672 px).
// Celular: recorte vertical 3:5 feito para cada foto, enquadrando o assunto principal (bandeira, entrega do
// algodão-doce, lanches). A 1ª tem preload no index.html.
const heroSrc = (name: string) => ({
  src: `/hero/${name}-1672.webp`,
  srcSet: `/hero/${name}-900.webp 900w, /hero/${name}-1672.webp 1672w`,
  mobile: `/hero/${name}-mobile.webp`,
})
const SLIDES = [
  { ...heroSrc('hero-bandeira'), alt: 'Torcida da Rasta com a bandeira do movimento na arquibancada do Bezerrão', position: 'center 40%', pan: '-1.5%' },
  { ...heroSrc('hero-algodao-doce'), alt: 'Integrante da Rasta entregando algodão-doce para uma criança em ação social', position: 'center 35%', pan: '1.5%' },
  { ...heroSrc('hero-lanches'), alt: 'Integrantes da Rasta preparando lanches para uma ação social', position: 'center 30%', pan: '-1%' },
]
const SLIDE_MS = 4000

export function HeroSlideshow() {
  // "leaving" = foto que está saindo: fica inteira por baixo enquanto a nova surge por cima (sem escurecer no meio).
  const [{ active, leaving }, setSlides] = useState({ active: 0, leaving: -1 })
  const [paused, setPaused] = useState(false)
  // As fotos 2 e 3 só começam a baixar depois que a 1ª apareceu (a 1ª chega mais rápido no celular).
  const [loadRest, setLoadRest] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setLoadRest(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])
  const goTo = (next: number) => setSlides((s) => (next === s.active ? s : { active: next, leaving: s.active }))

  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(() => goTo((active + 1) % SLIDES.length), SLIDE_MS)
    return () => window.clearTimeout(timer)
  }, [active, paused])

  return (
    <section id="top" aria-roledescription="carrossel" aria-label="Fotos do Movimento Rasta do Gama" className="relative h-[88vh] min-h-[560px] overflow-hidden bg-[var(--color-black)] text-white md:h-screen md:max-h-[900px]">
      {/* camada isolada: o empilhamento das fotos (z-index da troca) não passa por cima do texto */}
      <div className="absolute inset-0 isolate">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`hero-slide absolute inset-0 ${i === active ? 'is-active' : ''} ${i === leaving ? 'is-leaving' : ''}`}
          style={{ '--pan': slide.pan } as CSSProperties}
          aria-hidden={i !== active}
        >
          {(i === 0 || loadRest) && (
            <picture>
              <source media="(max-width: 767px)" srcSet={slide.mobile} width={564} height={941} />
              <img
                src={slide.src}
                srcSet={slide.srcSet}
                sizes="100vw"
                width={1672}
                height={941}
                alt={slide.alt}
                className="hero-photo h-full w-full object-cover"
                style={{ '--pos': slide.position } as CSSProperties}
                fetchPriority={i === 0 ? 'high' : 'low'}
                decoding={i === 0 ? 'sync' : 'async'}
              />
            </picture>
          )}
        </div>
      ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/70" aria-hidden="true" />

      <div className="relative mx-auto flex h-full max-w-[1100px] flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow text-[var(--color-sun)]">Movimento popular e cultural · Gama – DF</p>
        <h1 className="heading mt-4 text-[3.4rem] leading-[0.95] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] sm:text-7xl md:text-[6.5rem]">
          Igualdade, paz
          <br />e amizade
        </h1>
        <p className="mt-5 max-w-xl text-base text-white/90 md:text-lg">
          Mais que torcida: cultura, respeito e ação social dentro e fora do Bezerrão.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/#quem-somos" className="btn-sun flex min-h-12 items-center gap-2 rounded px-7 text-sm">
            Conheça o movimento <ArrowRight size={16} />
          </Link>
          <Link to="/#acao-social" className="btn-ghost-light flex min-h-12 items-center rounded px-7 text-sm">
            Ação social
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 flex items-center justify-center gap-1">
        {SLIDES.map((slide, i) => {
          const rastaColors = ['#12a150', '#ffcd00', '#e0342b'] // verde, amarelo, vermelho
          const barColor = rastaColors[i] || rastaColors[0]
          return (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Mostrar foto ${i + 1}`}
              aria-current={i === active}
              className="flex h-11 items-center justify-center px-1.5"
            >
              {/* barrinha que enche durante os 4 s da foto */}
              <span className={`relative block h-1 overflow-hidden rounded-full transition-[width] duration-700 ${i === active ? 'w-12' : 'w-6'}`} style={{ backgroundColor: `${barColor}33` }}>
                {i === active && (
                  <span
                    key={`${active}-${paused}`}
                    className="hero-progress absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: barColor, animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                  />
                )}
              </span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="ml-2 min-h-11 px-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 hover:text-white"
        >
          {paused ? 'Continuar' : 'Pausar'}
        </button>
      </div>
    </section>
  )
}

/* ---------- Quem somos ---------- */
const NUMBERS = [
  { value: '2 mil+', label: 'pessoas acompanham o movimento nas redes' },
  { value: '5', label: 'ações e campanhas sociais em 2026' },
  { value: '5', label: 'marcas apoiaram o Dia das Crianças' },
]

export function AboutRasta() {
  return (
    <section id="quem-somos" className="section-y">
      <div className="mx-auto max-w-[1100px] px-5 text-center md:px-10">
        <p className="eyebrow text-[var(--color-text-muted)]">Quem somos</p>
        <h2 className="heading title-rule mt-3 text-4xl text-[var(--color-ink)] md:text-6xl">Mais que torcida, um movimento</h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[var(--color-text-muted)] md:text-xl">
          O <strong className="text-[var(--color-ink)]">Movimento Rasta do Gama</strong> nasceu na arquibancada Norte do Bezerrão para unir o
          amor pela Sociedade Esportiva do Gama aos valores da cultura reggae: <strong className="text-[var(--color-brand)]">igualdade, paz e amizade</strong>.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-[1100px] md:mt-10 md:grid-cols-2">
        <img src={arquibancada} alt="Bandeiras e torcida do Gama na arquibancada" width={1100} height={619} className="h-72 w-full object-cover md:h-full" loading="lazy" />
        <div className="relative overflow-hidden bg-[var(--color-brand)] px-6 py-8 text-white md:px-12 md:py-12">
          <img src={logoPapagaio} alt="" aria-hidden="true" width={590} height={640} className="pointer-events-none absolute -right-10 -bottom-10 h-auto w-56 opacity-15" />
          <p className="relative text-lg leading-relaxed">
            Somos um movimento popular e cultural de torcedores. Levamos música, arte, faixas e bandeiras para o estádio, não
            compactuamos com violência nem discriminação e transformamos a paixão pelo Gama em ação na comunidade.
          </p>
          <dl className="relative mt-8 grid grid-cols-3 gap-4 border-t border-white/25 pt-6">
            {NUMBERS.map((n) => (
              <div key={n.label}>
                <dt className="heading text-4xl text-[var(--color-sun)] md:text-5xl">{n.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-white/85 md:text-sm">{n.label}</dd>
              </div>
            ))}
          </dl>
          <Link to="/quem-somos" className="relative mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-white underline-offset-4 hover:underline">
            Conheça nossa história <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------- Área social: vídeo no centro, fotos em volta ---------- */
type Photo = { src: string; alt: string; caption: string; rotate: string; className?: string }

const LEFT_PHOTOS: Photo[] = [
  { src: socialUpa, alt: 'Integrantes da Rasta em visita a uma UPA', caption: 'Visita à UPA', rotate: '-4deg', className: 'aspect-[3/4]' },
  { src: heroAlgodao, alt: 'Algodão-doce sendo entregue a uma criança', caption: 'Algodão-doce pra criançada', rotate: '3deg', className: 'aspect-[4/3] lg:ml-10' },
]
const RIGHT_PHOTOS: Photo[] = [
  { src: socialBandeira, alt: 'Integrantes da Rasta segurando a bandeira Igualdade Paz Amizade', caption: 'Igualdade · Paz · Amizade', rotate: '3deg', className: 'aspect-[4/3]' },
  { src: socialLembrancinhas, alt: 'Lembrancinhas embaladas com o selo da Rasta do Gama', caption: 'Lembrancinhas da Rasta', rotate: '-3deg', className: 'aspect-[3/4] lg:ml-8 lg:w-[80%]' },
]

function Polaroid({ photo }: { photo: Photo }) {
  return (
    <figure className="polaroid" style={{ transform: `rotate(${photo.rotate})` }}>
      <img src={photo.src} alt={photo.alt} loading="lazy" className={`w-full object-cover ${photo.className ?? ''}`} />
      <figcaption className="brush mt-3 text-center text-base text-[var(--color-ink)]">{photo.caption}</figcaption>
    </figure>
  )
}

function SocialVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [inView, setInView] = useState(false)

  // O vídeo (≈4 MB) só começa a baixar quando a área social está perto de aparecer.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, { rootMargin: '300px' })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])
  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
    if (!video.muted) void video.play()
  }

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div className="overflow-hidden rounded-[28px] border-[10px] border-white bg-black shadow-[0_24px_60px_rgba(8,61,33,0.35)]">
        <video
          ref={videoRef}
          src={inView ? '/media/acao-social.mp4' : undefined}
          poster="/media/acao-social-poster.webp"
          className="aspect-[2/3] w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          width={400}
          height={600}
          aria-label="Vídeo da ação social da Rasta do Gama com as crianças"
        />
      </div>
      <button
        type="button"
        onClick={toggleSound}
        className="absolute right-5 bottom-5 flex min-h-11 items-center gap-2 rounded-full bg-black/60 px-4 text-xs font-semibold uppercase tracking-[0.1em] text-white backdrop-blur hover:bg-black/80"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        {muted ? 'Ativar som' : 'Silenciar'}
      </button>
      <span className="rasta-stripe absolute -bottom-3 left-1/2 w-24 -translate-x-1/2 rounded-full" aria-hidden="true" />
    </div>
  )
}

const ACTIONS = [
  { date: '10 out 2026', title: 'Dia das Crianças', text: 'Festa na Cáritas Paroquial São José, em Santa Maria.' },
  { date: '15 set 2026', title: 'Roupas e agasalhos', text: 'Doação ao Recanto Cristo Vivo, em Valparaíso.' },
  { date: 'Set 2026', title: 'Setembro Amarelo', text: 'Ligue 188: sua vida importa.' },
  { date: '2026', title: 'Inclusão no estádio', text: 'Abafadores de ruído para pessoas autistas no Bezerrão.' },
]

export function SocialArea() {
  return (
    <section id="acao-social" className="section-y relative overflow-hidden bg-[var(--color-bg-soft)]">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="text-center">
          <p className="eyebrow text-[var(--color-text-muted)]">Ação social</p>
          <h2 className="heading title-rule mt-3 text-4xl text-[var(--color-ink)] md:text-6xl">A paixão pelo Gama virando cuidado</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-muted)]">
            Com a força da torcida e de parceiros, a Rasta leva alegria, doações e acolhimento para a comunidade do Gama e região.
          </p>
        </div>

        <div className="mt-8 grid items-center gap-8 md:mt-10 lg:grid-cols-[1fr_340px_1fr] lg:gap-10">
          <div className="order-2 grid grid-cols-2 gap-6 lg:order-1 lg:grid-cols-1 lg:gap-10">
            {LEFT_PHOTOS.map((photo) => (
              <Polaroid key={photo.caption} photo={photo} />
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <SocialVideo />
          </div>
          <div className="order-3 grid grid-cols-2 gap-6 lg:grid-cols-1 lg:gap-10">
            {RIGHT_PHOTOS.map((photo) => (
              <Polaroid key={photo.caption} photo={photo} />
            ))}
          </div>
        </div>

        {/* 2 × 2 no celular e tablet, 4 lado a lado no computador; cartões com a mesma altura em cada linha */}
        <ol className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:mt-10 lg:grid-cols-4">
          {ACTIONS.map((action) => (
            <li
              key={action.title}
              className="flex h-full flex-col border-t-4 border-[var(--color-brand)] bg-white p-4 shadow-[0_6px_20px_rgba(8,61,33,0.06)] sm:p-5"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-brand)] sm:text-xs sm:tracking-[0.15em]">
                {action.date}
              </p>
              <p className="heading mt-2 text-[1.35rem] leading-[1.05] text-[var(--color-ink)] sm:text-2xl">{action.title}</p>
              <p className="mt-1.5 text-[0.8rem] leading-snug text-[var(--color-text-muted)] sm:text-sm">{action.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- Como atuamos (grade de fotos, como os "Programas" do Instituto Galo) ---------- */
const PILLARS = [
  { title: 'Na arquibancada', img: heroBandeira, href: '/quem-somos', position: 'center 35%' },
  { title: 'Crianças e famílias', img: heroAlgodao, href: '/#acao-social', position: 'center 30%' },
  { title: 'Solidariedade', img: heroLanches, href: '/#acao-social', position: 'center 30%' },
  { title: 'Cultura e identidade', img: socialBandeira, href: '/quem-somos', position: 'center 45%' },
]

export function HowWeAct() {
  return (
    <section id="como-atuamos" className="section-y">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 md:px-10 lg:grid-cols-[0.8fr_2fr] lg:items-end">
        <div>
          <p className="eyebrow text-[var(--color-text-muted)]">Como atuamos</p>
          <h2 className="heading title-rule title-rule-left mt-3 text-5xl leading-[0.95] text-[var(--color-ink)] md:text-6xl">
            Da arquibancada para a comunidade
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
          {PILLARS.map((pillar) => (
            <Link key={pillar.title} to={pillar.href} className="group relative block aspect-[3/4] overflow-hidden bg-black md:aspect-[3/5]">
              <img
                src={pillar.img}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover opacity-80 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                style={{ objectPosition: pillar.position }}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" aria-hidden="true" />
              <span className="absolute inset-x-4 bottom-5 text-white">
                <span className="heading block text-2xl md:text-3xl">{pillar.title}</span>
                <span className="mt-2 inline-block border border-white px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em]">Saiba mais</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Loja: vitrine polaroid (mesmo estilo criativo da área social) ---------- */
// Só produtos com foto real; cada polaroid troca sozinha entre as fotos do produto, em tempos diferentes.
const SHOWCASE = PRODUCTS.filter((p) => p.images.length > 0)
const SHOWCASE_LOOK = [
  { rotate: '-4deg', offset: 'lg:mt-0' },
  { rotate: '3deg', offset: 'lg:mt-10' },
  { rotate: '-2deg', offset: 'lg:mt-4' },
  { rotate: '4deg', offset: 'lg:mt-12' },
]

function ShowcasePolaroid({ product, index }: { product: Product; index: number }) {
  const [photo, setPhoto] = useState(0)
  const look = SHOWCASE_LOOK[index % SHOWCASE_LOOK.length]

  useEffect(() => {
    if (product.images.length < 2) return
    let timer: number | undefined
    const start = window.setTimeout(() => {
      setPhoto((p) => (p + 1) % product.images.length)
      timer = window.setInterval(() => setPhoto((p) => (p + 1) % product.images.length), 3600)
    }, 1800 + index * 900)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(timer)
    }
  }, [product.images.length, index])

  return (
    <Link
      to={`/produtos/${product.slug}`}
      className={`polaroid tape group block ${look.offset}`}
      style={{ transform: `rotate(${look.rotate})` }}
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {product.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === 0 ? product.name : ''}
            aria-hidden={i !== photo}
            loading="lazy"
            className={`showcase-fade absolute inset-0 h-full w-full object-contain p-2 ${i === photo ? 'is-active' : ''}`}
          />
        ))}
        {product.badge && (
          <span className="absolute left-2 top-2 z-[1] bg-[var(--color-alert)] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-[var(--color-black)]">
            {product.badge}
          </span>
        )}
        <span className="absolute bottom-2 left-1/2 z-[1] flex -translate-x-1/2 gap-1" aria-hidden="true">
          {product.images.map((src, i) => (
            <span key={src} className={`h-1.5 rounded-full transition-all duration-500 ${i === photo ? 'w-4 bg-[var(--color-brand)]' : 'w-1.5 bg-black/25'}`} />
          ))}
        </span>
      </div>
      <p className="brush mt-3 text-center text-lg leading-tight text-[var(--color-ink)]">{product.name}</p>
      <p className="mt-1 text-center text-sm font-bold text-[var(--color-brand)]">
        {formatPrice(product)} <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
      </p>
    </Link>
  )
}

export function StoreSection() {
  return (
    <section id="loja" className="section-y relative overflow-hidden bg-[var(--color-brand)] text-white">
      <div className="pattern-dots absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="text-center">
          <p className="eyebrow text-[var(--color-sun)]">Loja do movimento</p>
          <h2 className="heading title-rule mt-3 text-5xl md:text-6xl">Vista a causa</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            Camisas, bonés, casacos e acessórios levam a identidade da Rasta para a arquibancada e para a rua, e ajudam o
            movimento a seguir de pé.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:gap-x-8 lg:grid-cols-4">
          {SHOWCASE.map((product, i) => (
            <ShowcasePolaroid key={product.slug} product={product} index={i} />
          ))}
        </div>

        <div className="mt-10 text-center md:mt-12">
          <Link to="/produtos" className="btn-sun inline-flex min-h-12 items-center gap-2 rounded px-8 text-sm">
            <Shirt size={17} /> Ver todos os produtos
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------- Apoie (como o "Ajude o Instituto" da referência) ---------- */
export function SupportSection() {
  return (
    <section id="apoie" className="section-y relative">
      <div className="mx-auto grid max-w-[1200px] items-center gap-6 bg-[var(--color-bg-soft)] px-6 py-10 md:grid-cols-[1.3fr_0.7fr] md:px-14 md:py-12">
        <div>
          <p className="eyebrow text-[var(--color-text-muted)]">Como apoiar</p>
          <h2 className="heading mt-3 text-5xl leading-[0.95] text-[var(--color-ink)] md:text-6xl">
            Ajude a Rasta a fazer
            <br />
            mais pela nossa gente
          </h2>
          <ul className="mt-6 space-y-2 text-[var(--color-text-muted)]">
            <li><strong className="text-[var(--color-ink)]">Patrocine uma ação:</strong> a partir de R$ 50, com divulgação da sua marca nos perfis da Rasta.</li>
            <li><strong className="text-[var(--color-ink)]">Doe:</strong> roupas, agasalhos e itens para as ações com as crianças.</li>
            <li><strong className="text-[var(--color-ink)]">Faça parte:</strong> venha para a arquibancada Norte e some com o movimento.</li>
          </ul>
          <a
            href={whatsappLink('Olá, Rasta! Vim pelo site e quero apoiar o movimento.')}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('whatsapp_click', { source: 'apoie' })}
            className="btn-sun mt-8 inline-flex min-h-12 items-center gap-2 rounded px-7 text-sm"
          >
            <HandHeart size={18} /> Quero apoiar
          </a>
        </div>
        <img src={logoPapagaio} alt="Papagaio rasta, símbolo do movimento" width={590} height={640} className="mx-auto w-48 drop-shadow-[0_18px_30px_rgba(8,61,33,0.3)] md:w-64" loading="lazy" />
      </div>
    </section>
  )
}

/* ---------- Parceiros ---------- */
// Logos tiradas das artes de "Patrocinador oficial" que a Rasta postou no Instagram (e perfil da Gama Stickers),
// convertidas para o mesmo cinza dos nomes. Quem ainda não tem logo aparece pelo nome.

// Instagram de cada parceiro (os @ das artes de patrocínio da Rasta). Sem @ confirmado = sem link.
const ig = (handle: string) => `https://www.instagram.com/${handle}/`
const PARTNERS: { name: string; logo?: string; href?: string }[] = [
  { name: 'Audity Centro Auditivo', logo: logoAudity, href: ig('auditycentroauditivo') },
  { name: 'Dr. Honda', logo: logoHonda, href: ig('doctoor_honda') },
  { name: 'Sebo do Gama', logo: logoSebo, href: ig('sebodogama') },
  { name: 'Agência Planaltour', logo: logoPlanaltour, href: ig('agenciaplanaltour') },
  { name: 'Bonde Guaronha', logo: logoGuaronha, href: ig('bondeguara') },
  { name: 'Gama Stickers', logo: logoGamaStickers, href: ig('gamastickers') },
  { name: 'Cáritas Paroquial São José' },
  { name: 'Recanto Cristo Vivo', href: ig('recantocristovivo') },
]

export function Partners() {
  return (
    <section id="parceiros" className="section-y bg-[#eeeeec]">
      <div className="mx-auto max-w-[1100px] px-5 text-center md:px-10">
        <p className="eyebrow text-[var(--color-text-muted)]">Quem caminha com a gente</p>
        <h2 className="heading title-rule mt-3 text-4xl text-[var(--color-ink)] md:text-5xl">Nossos parceiros</h2>
        <ul className="mt-8 grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-4 md:mt-10 md:gap-y-10">
          {PARTNERS.map((p) => (
            <li key={p.name} className="flex h-16 items-center justify-center md:h-20">
              {(() => {
                const content = p.logo ? (
                  <img src={p.logo} alt={p.name} loading="lazy" className="max-h-full max-w-[150px] object-contain md:max-w-[170px]" />
                ) : (
                  <span className="heading text-xl text-[#4f5752] md:text-2xl">{p.name}</span>
                )
                return p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.name} no Instagram (abre em nova aba)`}
                    className="flex h-full items-center justify-center rounded opacity-90 transition hover:scale-105 hover:opacity-100"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )
              })()}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Trilho de produtos (usado na página de produto) ---------- */
export function ProductRail({ title, watermark, products, id }: { title: string; watermark: string; products: readonly Product[]; id?: string }) {
  const railRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => railRef.current?.scrollBy({ left: dir * railRef.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <section id={id} className="section-y mx-auto max-w-[1200px] px-5 md:px-10">
      <div className="relative flex items-end justify-between gap-4">
        <Watermark>{watermark}</Watermark>
        <h2 className="heading relative text-3xl md:text-4xl">{title}</h2>
        <div className="relative flex gap-2">
          <button type="button" onClick={() => scroll(-1)} aria-label={`${title}: anteriores`} className="flex h-11 w-11 items-center justify-center rounded bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-deep)]">
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={`${title}: próximos`} className="flex h-11 w-11 items-center justify-center rounded bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-deep)]">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div ref={railRef} className="rail mt-8 flex gap-3 overflow-x-auto pb-3 md:gap-4">
        {products.map((product) => (
          <div key={product.slug} className="w-[62%] shrink-0 sm:w-[40%] md:w-[calc(25%-12px)]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
