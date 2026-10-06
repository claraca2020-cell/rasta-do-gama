import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Droplet, GraduationCap, HandHeart, HeartPulse, PawPrint, Shirt, Ticket, Trees, Volume2, VolumeX } from 'lucide-react'
import logoPapagaio from '../assets/brand/logo-papagaio.webp'
import heroAlgodao from '../assets/photos/hero-algodao-doce-sm.webp'
import pilarArquibancada from '../assets/photos/pilar-arquibancada.webp'
import pilarBaseGama from '../assets/photos/pilar-base-gama.webp'
import pilarCaravanas from '../assets/photos/pilar-caravanas.webp'
import pilarShows from '../assets/photos/pilar-shows-cultura.webp'
import quemSomosFoto from '../assets/photos/quem-somos-rasta.webp'
import socialBandeira from '../assets/photos/social-bandeira-rasta.webp'
import socialLembrancinhas from '../assets/photos/social-lembrancinhas.webp'
import socialUpa from '../assets/photos/social-upa.webp'
import { PRODUCTS, formatPrice, type Product } from '../data/products'
import { FIRST_ORDER_COUPON, SOCIAL_ACTIONS } from '../data/social'
import { trackEvent } from '../lib/analytics'
import { whatsappLink } from '../lib/contact'
import { Link } from '../lib/Link'
import logoMovimentoNacional from '../assets/partners/movimento-nacional.webp'
import logoRastaCast from '../assets/partners/rasta-cast.webp'
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
// 06/10/2026: saiu a foto da torcida com bandeiras ("não somos nós", pediu a Rasta). Entram as fotos que a Rasta mandou
// no WhatsApp em 05/10 (originais no Obsidian: 18 RASTA/18,5 PASTA DO CLIENTE/2026-10-05 WhatsApp).
const SLIDES = [
  { ...heroSrc('hero-noite'), alt: 'Faixa Rasta do Gama, movimento popular e cultural, na arquibancada do Bezerrão em jogo à noite', position: 'center 70%', pan: '-1.5%' },
  { ...heroSrc('hero-grupo'), alt: 'Integrantes da Rasta reunidos com a faixa do movimento', position: 'center 60%', pan: '1.5%' },
  { ...heroSrc('hero-caravana'), alt: 'Caravana da Rasta com a faixa Rasta do Gama ao lado do ônibus', position: 'center 50%', pan: '-1%' },
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
        <p className="eyebrow text-[var(--color-leaf)]">Movimento popular e cultural · Gama – DF</p>
        <h1 className="heading mt-4 text-[3.4rem] leading-[0.95] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] sm:text-7xl md:text-[6.5rem]">
          Igualdade, paz
          <br />e amizade
        </h1>
        <p className="brush mt-5 text-2xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] md:text-3xl">Liberdade para torcer</p>
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
// "5 marcas" saiu a pedido da Rasta (05/10/2026).
const NUMBERS = [
  { value: '2 mil+', label: 'pessoas acompanham o movimento nas redes' },
  { value: '5', label: 'ações e campanhas sociais em 2026' },
]

export function AboutRasta() {
  return (
    <section id="quem-somos" className="section-y">
      <div className="mx-auto max-w-[1100px] px-5 text-center md:px-10">
        <p className="eyebrow text-[var(--color-text-muted)]">Quem somos</p>
        <h2 className="heading title-rule mt-3 text-4xl text-[var(--color-ink)] md:text-6xl">Movimento popular e cultural</h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[var(--color-text-muted)] md:text-xl">
          A <strong className="text-[var(--color-ink)]">Rasta do Gama</strong> nasceu da conexão do amor pelo clube e os valores da cultura
          reggae, sendo criada em 2026 por amigos e amantes da <strong className="text-[var(--color-brand)]">Sociedade Esportiva do Gama</strong>.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-[1100px] md:mt-12 md:grid-cols-2">
        <img src={quemSomosFoto} alt="Torcida da Rasta com a faixa RASTA, Igualdade, Paz e Amizade" width={1100} height={699} className="h-72 w-full object-cover md:h-full" loading="lazy" />
        <div className="relative overflow-hidden bg-[var(--color-bg-soft)] px-6 py-8 text-[var(--color-ink)] md:px-12 md:py-12">
          <img src={logoPapagaio} alt="" aria-hidden="true" width={590} height={640} className="pointer-events-none absolute -right-10 -bottom-10 h-auto w-56 opacity-[0.06]" />
          <p className="relative text-lg leading-relaxed">
            Somos um movimento popular e cultural de torcedores. Levamos música, arte, faixas e bandeiras para o estádio, não
            compactuamos com violência nem discriminação e transformamos a paixão pelo Gama em ação na comunidade.
          </p>
          <dl className="relative mt-8 grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-6">
            {NUMBERS.map((n) => (
              <div key={n.label}>
                <dt className="heading text-4xl text-[var(--color-brand)] md:text-5xl">{n.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-[var(--color-text-muted)] md:text-sm">{n.label}</dd>
              </div>
            ))}
          </dl>
          <Link to="/quem-somos" className="relative mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--color-brand)] underline-offset-4 hover:underline">
            Conheça nossa história <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------- Área social: vídeo no centro, fotos em volta ---------- */
type Photo = { src: string; alt: string; caption: string; rotate: string; className?: string }

// Legendas enviadas pela Rasta (05/10/2026).
const LEFT_PHOTOS: Photo[] = [
  { src: socialUpa, alt: 'Integrantes da Rasta entregando janta em uma UPA', caption: 'Entrega de janta em hospitais e UPA', rotate: '-4deg', className: 'aspect-[3/4]' },
  { src: heroAlgodao, alt: 'Algodão-doce sendo entregue a uma criança na ação de Páscoa', caption: 'Ação social de Páscoa', rotate: '3deg', className: 'aspect-[4/3] lg:ml-10' },
]
const RIGHT_PHOTOS: Photo[] = [
  { src: socialBandeira, alt: 'Integrantes da Rasta em ação de doação de agasalhos e roupas', caption: 'Doação de agasalhos e roupas para associações de acolhimento', rotate: '3deg', className: 'aspect-[4/3]' },
  { src: socialLembrancinhas, alt: 'Lembrancinhas e ovos de Páscoa embalados com o selo da Rasta do Gama', caption: '+ de 200 ovos de Páscoa entregues', rotate: '-3deg', className: 'aspect-[3/4] lg:ml-8 lg:w-[80%]' },
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
      <div className="overflow-hidden rounded-3xl border-[8px] border-white bg-black shadow-[0_16px_40px_rgba(8,61,33,0.16)]">
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
          aria-label="Vídeo da ação social de Páscoa da Rasta do Gama com as crianças"
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

        <div className="mt-10 grid items-center gap-8 md:mt-12 lg:grid-cols-[1fr_340px_1fr] lg:gap-12">
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

        {/* 1 coluna no celular, 2 no tablet, 5 lado a lado no computador; cartões com a mesma altura em cada linha */}
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 md:mt-12 lg:grid-cols-5">
          {SOCIAL_ACTIONS.map((action) => (
            <li
              key={action.title}
              className="flex h-full flex-col rounded-xl sm:last:col-span-2 lg:last:col-span-1 border-t-2 border-[var(--color-brand)] bg-white p-4 shadow-[0_4px_16px_rgba(8,61,33,0.045)] sm:p-5"
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
  // Fotos e legendas enviadas pela Rasta (05/10/2026).
  { title: 'Na arquibancada', img: pilarArquibancada, href: '/quem-somos', position: 'center 60%' },
  { title: 'Caravanas', img: pilarCaravanas, href: '/quem-somos', position: 'center 55%' },
  { title: 'Base do Gama', img: pilarBaseGama, href: '/#acao-social', position: 'center 55%' },
  { title: 'Shows e cultura', img: pilarShows, href: '/quem-somos', position: 'center 30%' },
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
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
          {PILLARS.map((pillar) => (
            <Link key={pillar.title} to={pillar.href} className="group relative block aspect-[3/4] overflow-hidden rounded-lg bg-black md:aspect-[3/5]">
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
    <section id="loja" className="section-y relative overflow-hidden bg-[var(--color-bg-soft)] text-[var(--color-ink)]">
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="text-center">
          <p className="eyebrow text-[var(--color-brand)]">Loja do movimento</p>
          <h2 className="heading title-rule mt-3 text-5xl text-[var(--color-ink)] md:text-6xl">Vista a causa</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-muted)]">
            Camisas, bonés, casacos e acessórios levam a identidade da Rasta para a arquibancada e para a rua, e ajudam o
            movimento a seguir de pé.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:gap-x-8 lg:grid-cols-4">
          {SHOWCASE.map((product, i) => (
            <ShowcasePolaroid key={product.slug} product={product} index={i} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12">
          <Link to="/produtos" className="btn-brand inline-flex min-h-12 items-center gap-2 rounded px-8 text-sm">
            <Shirt size={17} /> Ver todos os produtos
          </Link>
          <CouponButton source="loja-home" />
        </div>
      </div>
    </section>
  )
}

/* ---------- Apoie (como o "Ajude o Instituto" da referência) ---------- */
export function SupportSection() {
  return (
    <section id="apoie" className="section-y relative">
      <div className="mx-auto grid max-w-[1200px] items-center gap-6 rounded-2xl bg-[var(--color-bg-soft)] px-6 py-10 md:grid-cols-[1.3fr_0.7fr] md:px-14 md:py-12">
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
            <li><strong className="text-[var(--color-ink)]">Faça parte:</strong> venha torcer com a gente no Bezerrão e some com o movimento.</li>
          </ul>
          <a
            href={whatsappLink('Olá, Rasta! Vim pelo site e quero apoiar o movimento.')}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('whatsapp_click', { source: 'apoie' })}
            className="btn-brand mt-8 inline-flex min-h-12 items-center gap-2 rounded px-7 text-sm"
          >
            <HandHeart size={18} /> Quero apoiar
          </a>
        </div>
        <img src={logoPapagaio} alt="Papagaio rasta, símbolo do movimento" width={590} height={640} className="mx-auto w-48 drop-shadow-[0_18px_30px_rgba(8,61,33,0.3)] md:w-64" loading="lazy" />
      </div>
    </section>
  )
}

/* ---------- Cupom de primeira compra (pedido da Rasta em 05/10/2026: botão que abre o WhatsApp) ---------- */
export function CouponButton({ source, className = '' }: { source: string; className?: string }) {
  return (
    <a
      href={whatsappLink(`Olá, Rasta! É minha primeira compra e quero usar o cupom ${FIRST_ORDER_COUPON} (5% de desconto).`)}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent('whatsapp_click', { source: `cupom-${source}` })}
      className={`btn-line inline-flex min-h-12 items-center gap-2 rounded px-7 text-sm ${className}`}
    >
      <Ticket size={17} /> 5% off na 1ª compra
    </a>
  )
}

/* ---------- Próximos passos do movimento (texto da Rasta, 05/10/2026) ---------- */
const NEXT_STEPS = [
  { icon: Trees, title: 'Natureza', text: 'Limpezas de cachoeiras e áreas de preservação.' },
  { icon: PawPrint, title: 'Animais', text: 'Ação social para ajudar cachorros e animais abandonados.' },
  { icon: HeartPulse, title: 'Saúde', text: 'Grupos de atividades físicas e cuidados com a saúde.' },
  { icon: Droplet, title: 'Doação de sangue', text: 'Mobilização para doar sangue nos hemocentros.' },
  { icon: GraduationCap, title: 'Educação', text: 'Cursinhos gratuitos para jovens se prepararem para vestibular, Enem e PAS.' },
]

export function NextSteps() {
  return (
    <section id="proximos-passos" className="section-y">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="text-center">
          <p className="eyebrow text-[var(--color-text-muted)]">Próximos passos</p>
          <h2 className="heading title-rule mt-3 text-4xl text-[var(--color-ink)] md:text-6xl">O que vem por aí</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-muted)]">
            A Rasta quer levar o mesmo cuidado para novas frentes, dentro e fora do estádio.
          </p>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 md:mt-12 lg:grid-cols-5">
          {NEXT_STEPS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-white p-5 sm:last:col-span-2 lg:last:col-span-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-brand)]" aria-hidden="true">
                <Icon size={20} />
              </span>
              <p className="heading mt-4 text-2xl text-[var(--color-ink)]">{title}</p>
              <p className="mt-1.5 text-sm leading-snug text-[var(--color-text-muted)]">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Amigos e colaboradores (substitui a faixa de patrocinadores, a pedido da Rasta em 05/10/2026) ---------- */
const FRIENDS = [
  {
    name: 'Rasta Cast',
    logo: logoRastaCast,
    text: 'Participação no podcast, conversando sobre ideologias com diferentes movimentos rastas.',
    href: 'https://www.youtube.com/live/CxxhvI25WY4',
    cta: 'Assistir no YouTube',
  },
  {
    name: 'Movimento Nacional Rastas & Reggae',
    logo: logoMovimentoNacional,
    text: 'Participação no movimento nacional de reggae: de norte a sul, todos por uma missão, paz nos estádios.',
    href: 'https://www.instagram.com/movrastasereggaebr/',
    cta: 'Ver no Instagram',
  },
]

export function Friends() {
  return (
    <section id="amigos" className="section-y bg-[var(--color-bg-soft)]">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        <div className="text-center">
          <p className="eyebrow text-[var(--color-text-muted)]">Quem caminha com a gente</p>
          <h2 className="heading title-rule mt-3 text-4xl text-[var(--color-ink)] md:text-5xl">Amigos e colaboradores</h2>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {FRIENDS.map((friend) => (
            <li key={friend.name} className="flex flex-col rounded-xl bg-white p-6 shadow-[0_4px_16px_rgba(8,61,33,0.045)] md:p-8">
              <img src={friend.logo} alt={`Logo ${friend.name}`} width={400} height={400} loading="lazy" className="mb-4 h-24 w-24 rounded-full object-cover" />
              <p className="heading text-3xl text-[var(--color-ink)]">{friend.name}</p>
              <p className="mt-2 flex-1 text-[var(--color-text-muted)]">{friend.text}</p>
              <a
                href={friend.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 self-start font-semibold text-[var(--color-brand)] underline-offset-4 hover:underline"
              >
                {friend.cta} <ArrowRight size={16} />
                <span className="sr-only">(abre em nova aba)</span>
              </a>
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
