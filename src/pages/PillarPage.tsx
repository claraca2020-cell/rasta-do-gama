import { ArrowRight, MessageCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { PageBanner } from '../components/PageBanner'
import { Caravans, PILLAR_SLUGS, Polaroid, SocialArea, type Photo } from '../components/HomeSections'
import fotos from '../data/fotos.json'
import { whatsappLink } from '../lib/contact'
import { Link } from '../lib/Link'

// Páginas de "Como atuamos": cada card da home abre uma página só do assunto (pedido do Jamerson, 17/11/2026).
// Textos reaproveitados do próprio site (Quem somos / home) — nada inventado. Quando a Rasta mandar texto e fotos
// novos de cada assunto, é só trocar aqui. Dúvidas vão sempre para o WhatsApp.

type Pillar = { slug: string; title: string; whatsapp: string; content: () => ReactNode }

const LOOKS = ['-3deg', '2deg', '-2deg', '3deg']
const polaroids = (lista: { foto: string; alt: string; legenda: string }[]): Photo[] =>
  lista.map((f, i) => ({ src: f.foto, alt: f.alt, caption: f.legenda, rotate: LOOKS[i % LOOKS.length], className: 'aspect-[4/3]' }))

function Intro({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="eyebrow text-[var(--color-text-muted)]">{eyebrow}</p>
      <h2 className="heading title-rule mt-3 text-4xl text-[var(--color-ink)] md:text-6xl">{title}</h2>
      <div className="mt-5 space-y-4 text-lg leading-relaxed text-[var(--color-text-muted)]">{children}</div>
    </div>
  )
}

function Gallery({ photos }: { photos: Photo[] }) {
  return (
    <div className="mx-auto mt-10 grid max-w-[1100px] grid-cols-2 gap-6 md:mt-12 md:grid-cols-4 md:gap-8">
      {photos.map((photo) => (
        <Polaroid key={photo.src} photo={photo} />
      ))}
    </div>
  )
}

const ARQUIBANCADA = polaroids([
  { foto: fotos.pilares[0]?.foto ?? '/fotos/pilar-arquibancada.webp', alt: 'Rasta do Gama na arquibancada', legenda: 'BEZERRÃO' },
  { foto: '/fotos/bezerrao-noite.webp', alt: 'Faixa Movimento Rasta na arquibancada do Bezerrão em jogo à noite', legenda: 'JOGO À NOITE' },
  { foto: '/hero/hero-noite-1672.webp', alt: 'Faixa Rasta do Gama na arquibancada do Bezerrão', legenda: 'NOSSA FAIXA' },
  { foto: '/fotos/rasta-reunida.webp', alt: 'Integrantes da Rasta reunidos', legenda: 'RASTA REUNIDA' },
])

const SHOWS = polaroids([
  { foto: fotos.pilares[3]?.foto ?? '/fotos/pilar-shows-cultura.webp', alt: 'Rasta do Gama em show e cultura', legenda: 'SHOWS E CULTURA' },
  { foto: '/hero/hero-grupo-1672.webp', alt: 'Pré-jogo Rasta do Gama, resenha e amizade', legenda: 'PRÉ-JOGO' },
  { foto: '/fotos/social-bandeira-rasta.webp', alt: 'Integrantes da Rasta com a bandeira Igualdade, Paz e Amizade', legenda: 'IGUALDADE, PAZ E AMIZADE' },
  { foto: '/fotos/quem-somos-rasta.webp', alt: 'Torcida da Rasta do Gama', legenda: 'CULTURA REGGAE' },
])

export const PILLARS: Pillar[] = [
  {
    slug: PILLAR_SLUGS[0],
    title: fotos.pilares[0]?.titulo ?? 'Na arquibancada',
    whatsapp: 'Olá, Rasta! Vim pelo site e quero torcer com vocês no Bezerrão. Como faço?',
    content: () => (
      <section className="section-y">
        <div className="px-5 md:px-10">
          <Intro eyebrow="Na arquibancada" title="Liberdade para torcer">
            <p>
              Nossa principal atividade é apoiar o Gama no <strong className="text-[var(--color-ink)]">Bezerrão</strong>, com bandeiras,
              faixas e música. Aonde o Gama for, a gente está.
            </p>
            <p>Não compactuamos com violência nem discriminação. Nosso lema: igualdade, paz e amizade.</p>
          </Intro>
          <Gallery photos={ARQUIBANCADA} />
        </div>
      </section>
    ),
  },
  {
    slug: PILLAR_SLUGS[1],
    title: fotos.pilares[1]?.titulo ?? 'Caravanas',
    whatsapp: 'Olá, Rasta! Vim pelo site e quero saber da próxima caravana.',
    content: () => <Caravans />,
  },
  {
    slug: PILLAR_SLUGS[2],
    title: fotos.pilares[2]?.titulo ?? 'Base do Gama',
    whatsapp: 'Olá, Rasta! Vim pelo site e quero ajudar nas ações na comunidade.',
    content: () => <SocialArea />,
  },
  {
    slug: PILLAR_SLUGS[3],
    title: fotos.pilares[3]?.titulo ?? 'Shows e cultura',
    whatsapp: 'Olá, Rasta! Vim pelo site e quero saber dos próximos shows e eventos.',
    content: () => (
      <section className="section-y">
        <div className="px-5 md:px-10">
          <Intro eyebrow="Shows e cultura" title="Cultura reggae no estádio">
            <p>
              A Rasta nasceu da conexão do amor pelo Gama com os valores da cultura reggae. Levamos música, arte, faixas e
              bandeiras para o estádio.
            </p>
            <blockquote className="border-l-4 border-[var(--color-brand)] pl-5 text-left italic">
              “A Rasta nasceu para levar a cultura reggae aos estádios e mostrar que a arquibancada pode ser um espaço de paz,
              respeito.”
              <footer className="mt-2 text-sm not-italic">Jamerson Abrantes, ao CidadeCULT (abril de 2026)</footer>
            </blockquote>
          </Intro>
          <Gallery photos={SHOWS} />
        </div>
      </section>
    ),
  },
]

export const findPillar = (slug?: string) => PILLARS.find((p) => p.slug === slug)

export function PillarPage({ pillar }: { pillar: Pillar }) {
  const others = PILLARS.filter((p) => p.slug !== pillar.slug)
  return (
    <>
      <PageBanner kicker="Como atuamos" title={pillar.title} />
      {pillar.content()}

      <section className="bg-[var(--color-black)] py-12 text-white md:py-16">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-5 px-5 text-center md:px-10">
          <h2 className="heading text-3xl md:text-4xl">Ficou com alguma dúvida?</h2>
          <p className="max-w-xl text-white/80">Fala com a gente direto no WhatsApp que a Rasta responde por lá.</p>
          <a
            href={whatsappLink(pillar.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className="btn-sun flex min-h-12 items-center gap-2 rounded px-7 text-sm"
          >
            <MessageCircle size={18} /> Tirar dúvida no WhatsApp
          </a>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-[1100px] px-5 md:px-10">
          <p className="eyebrow text-center text-[var(--color-text-muted)]">Conheça também</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                to={`/como-atuamos/${p.slug}`}
                className="flex min-h-14 items-center justify-between rounded-lg border border-[var(--color-border)] px-5 font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              >
                {p.title} <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
