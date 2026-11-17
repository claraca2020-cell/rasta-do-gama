import { ArrowRight, Bus, Ear, Flag, MapPin, Megaphone, MessageCircle, Mic, Music, Palette, ShieldCheck, Sprout, Trophy, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PILLAR_SLUGS, SocialVideo } from '../components/HomeSections'
import fotos from '../data/fotos.json'
import { whatsappLink } from '../lib/contact'
import { Link } from '../lib/Link'

// Páginas de "Como atuamos" (pedido do Jamerson, 17/11/2026): cada frente com abertura, explicação, como acontece,
// momentos com data, galeria e convite. Estrutura inspirada em páginas de programas de institutos de clube
// (ex.: Instituto Galo), com a cara da Rasta.
// Fontes de todos os fatos: notas 01, 02, 04, 15 e "Pesquisa bruta" do vault (Instagram @rastadogamaoficial,
// CidadeCULT 08/04/2026, Jornal de Brasília, Correio Braziliense) e mensagens da Manu (05/10/2026). Nada inventado.
// Regra da Rasta: não citar "arquibancada Norte" (o setor muda conforme o jogo) nem rivalidades.

type Shot = { src: string; alt: string; caption?: string; position?: string }
type Step = { icon: LucideIcon; title: string; text: string }
type Moment = { date: string; title: string; text: string }
type Pillar = {
  slug: string
  number: string
  title: string
  tagline: string
  hero: Shot
  intro: { heading: string; paragraphs: string[] }
  values: string[]
  stats?: { value: string; label: string }[]
  stepsTitle: string
  steps: Step[]
  quote?: { text: string; author: string }
  moments?: { title: string; items: Moment[] }
  video?: { src: string; poster: string; label: string }
  gallery: Shot[]
  galleryNote?: string
  cta: { title: string; text: string; button: string; message: string }
}

const P = fotos.pilares

export const PILLARS: Pillar[] = [
  {
    slug: PILLAR_SLUGS[0],
    number: '01',
    title: P[0]?.titulo ?? 'Na arquibancada',
    tagline: 'Liberdade para torcer, com paz, respeito e cultura reggae.',
    hero: { src: '/hero/hero-noite-2400.webp', alt: 'Faixa Rasta do Gama na arquibancada do Bezerrão em jogo à noite', position: 'center 60%' },
    intro: {
      heading: 'A arquibancada pode ser um espaço de paz',
      paragraphs: [
        'É no Bezerrão que a Rasta nasce a cada jogo. Bandeiras, faixas, adesivos e música levam para o estádio os valores da cultura reggae: igualdade, paz e amizade.',
        'Não somos uma torcida organizada. Somos um movimento popular e cultural que apoia o Gama sem compactuar com violência nem discriminação, e que usa a arquibancada para passar mensagens de consciência.',
      ],
    },
    values: ['Igualdade', 'Paz', 'Amizade', 'Respeito', 'Inclusão'],
    stats: [
      { value: '16.245', label: 'pessoas no Bezerrão no jogo do acesso' },
      { value: '16 anos', label: 'de espera até a volta à Série C' },
      { value: '4×0', label: 'Gama x São José, 16/08/2026' },
    ],
    stepsTitle: 'Como é um dia de jogo com a Rasta',
    steps: [
      { icon: Users, title: 'Pré-jogo', text: 'A Rasta se encontra antes da bola rolar: resenha, amizade e a faixa pronta para subir.' },
      { icon: Flag, title: 'Faixas e bandeiras', text: 'Os materiais da Rasta vestem a arquibancada com as cores do Gama e a identidade reggae.' },
      { icon: Music, title: 'Música e canto', text: 'Cantos que falam de paz, resistência e de valorizar as raízes.' },
      { icon: Ear, title: 'Inclusão', text: 'Projeto de abafadores de ruído para pessoas autistas acompanharem os jogos no Bezerrão.' },
    ],
    quote: { text: 'Acreditamos que o futebol transforma vidas.', author: 'Jamerson Abrantes, ao CidadeCULT (abril de 2026)' },
    moments: {
      title: 'Momentos na arquibancada',
      items: [
        { date: '10 abr 2026', title: 'Manifesto', text: 'União, respeito e igualdade. Contra a violência e a discriminação: paz nos estádios.' },
        { date: '16 ago 2026', title: 'O jogo do acesso', text: 'Gama 4×0 São José, com 16.245 pessoas no Bezerrão. Os materiais da Rasta estavam autorizados na arquibancada.' },
        { date: '10 set 2026', title: 'Setembro Amarelo', text: '"16.245 pessoas no jogo do acesso. Poderia ser 16.244. Não foi." Campanha pela vida: ligue 188.' },
      ],
    },
    gallery: [
      { src: '/fotos/bezerrao-noite.webp', alt: 'Faixa Movimento Rasta na arquibancada do Bezerrão à noite', caption: 'Noite de Bezerrão' },
      { src: '/fotos/arquibancada-torcida-dia.webp', alt: 'Integrantes da Rasta com a faixa RASTA na arquibancada', caption: 'A faixa no alto' },
      { src: fotos.quemSomos.foto, alt: fotos.quemSomos.alt, caption: 'Igualdade, paz e amizade' },
      { src: '/fotos/quem-somos-rasta.webp', alt: 'Torcida da Rasta atrás da faixa RASTA', caption: 'Liberdade para torcer' },
      { src: '/fotos/painel/2026-11/mw5m37e8-46239fea.webp', alt: 'Bonde da Rasta do Gama em dia de jogo', caption: 'Dia de jogo' },
      { src: '/hero/hero-grupo-1672.webp', alt: 'Pré-jogo da Rasta do Gama, resenha e amizade', caption: 'Pré-jogo' },
    ],
    cta: { title: 'Venha torcer com a gente', text: 'Quer saber onde a Rasta fica no próximo jogo? Chama no WhatsApp.', button: 'Quero torcer com a Rasta', message: 'Olá, Rasta! Vim pelo site e quero torcer com vocês no próximo jogo. Como faço?' },
  },
  {
    slug: PILLAR_SLUGS[1],
    number: '02',
    title: P[1]?.titulo ?? 'Caravanas',
    tagline: 'Aonde o Gama for, eu lá estou.',
    hero: { src: '/hero/hero-caravana-2400.webp', alt: 'Caravana da Rasta com a faixa Rasta do Gama ao lado do ônibus', position: 'center 55%' },
    intro: {
      heading: 'Horas de estrada pelo time do coração',
      paragraphs: [
        'Quando o Gama joga fora de casa, a Rasta vai junto. As caravanas reúnem o movimento no ônibus, com a faixa na bagagem, para que o time nunca jogue sozinho.',
        'Cada viagem é feita com a mesma regra da arquibancada: amizade, respeito e paz, do embarque até a volta.',
      ],
    },
    values: ['Estrada', 'União', 'Amizade', 'Paz'],
    stepsTitle: 'Como funciona uma caravana',
    steps: [
      { icon: Megaphone, title: 'A chamada', text: 'As caravanas são combinadas com a Rasta pelo WhatsApp e pelo Instagram.' },
      { icon: Bus, title: 'Pé na estrada', text: 'O grupo se encontra, a faixa vai junto e o ônibus pega a estrada.' },
      { icon: Flag, title: 'Faixa no estádio', text: 'Longe de casa, a faixa da Rasta sobe para o Gama não jogar sozinho.' },
    ],
    moments: {
      title: 'Por onde a Rasta já passou',
      items: [
        { date: 'Goiás', title: 'Aparecida (GO)', text: 'Caravana com a faixa do movimento ao lado do ônibus.' },
        { date: 'Goiás', title: 'Goiânia (GO)', text: 'Mais uma viagem para apoiar o Gama longe de casa.' },
        { date: 'Brasília', title: 'Final do Candangão', text: 'A Rasta presente na final, no Mané Garrincha.' },
      ],
    },
    video: { src: '/media/caravanas.mp4', poster: '/media/caravanas-poster.webp', label: 'Vídeo da caravana da Rasta do Gama: faixa RASTA no estádio' },
    gallery: [
      { src: '/fotos/pilar-caravanas.webp', alt: 'Integrantes da Rasta com a faixa ao lado do ônibus', caption: 'PÉ NA ESTRADA' },
      ...fotos.caravanas.map((f) => ({ src: f.foto, alt: f.alt, caption: f.legenda })),
      { src: '/fotos/rasta-reunida.webp', alt: 'Integrantes da Rasta reunidos com a faixa do movimento', caption: 'A RASTA REUNIDA' },
    ],
    cta: { title: 'Bora na próxima?', text: 'Pergunte pelo WhatsApp quando sai a próxima caravana e como garantir sua vaga.', button: 'Quero ir na próxima caravana', message: 'Olá, Rasta! Vim pelo site e quero saber da próxima caravana.' },
  },
  {
    slug: PILLAR_SLUGS[2],
    number: '03',
    title: P[2]?.titulo ?? 'Base do Gama',
    tagline: 'Apoiar as crianças faz toda diferença.',
    hero: { src: '/fotos/banner-interno.webp', alt: 'Rasta com a faixa acompanhando jogo das categorias de base do Gama', position: 'center 50%' },
    intro: {
      heading: 'A torcida também é dos meninos da base',
      paragraphs: [
        'O futuro do Gama começa nas categorias de base. Por isso a Rasta leva a faixa e o apoio também para os jogos do sub-11, do sub-13 e do sub-17.',
        'Para quem está começando, ter torcida faz diferença. É o mesmo cuidado que a Rasta leva para a comunidade nas ações com as crianças do Gama e da região.',
      ],
    },
    values: ['Sub-11', 'Sub-13', 'Sub-17'],
    stepsTitle: 'O que a Rasta faz pela base',
    steps: [
      { icon: Flag, title: 'Presença nos jogos', text: 'A faixa da Rasta acompanha as categorias de base do Gama.' },
      { icon: Sprout, title: 'Incentivo', text: 'Apoio a quem está começando, para crescer com o clube.' },
      { icon: Trophy, title: 'Futuro do Gama', text: 'Quem torce pela base torce pelo time que vem por aí.' },
    ],
    quote: { text: 'Apoiar as crianças faz toda diferença.', author: 'Movimento Rasta do Gama' },
    moments: {
      title: 'O cuidado com os pequenos fora de campo',
      items: [
        { date: '09 abr 2026', title: 'Páscoa solidária', text: 'No Jardim Ingá: alimentação, brinquedos e entrega de ovos de Páscoa e chocolates.' },
        { date: '10 out 2026', title: 'Dia das Crianças', text: 'Na paróquia São José: brinquedos, pintura facial, aulas de xadrez, grafite, corte de cabelo e lembrancinhas.' },
      ],
    },
    gallery: [
      { src: '/fotos/pilar-base-gama.webp', alt: 'Rasta com a faixa à beira do campo em jogo da base do Gama', caption: 'Beira de campo' },
      { src: '/fotos/banner-interno.webp', alt: 'Torcida da Rasta acompanhando jogo da base', caption: 'Base do Gama' },
      { src: '/fotos/painel/2026-11/mw5n3syd-636de1ea.webp', alt: 'Ação social da Rasta no Dia das Crianças', caption: 'Dia das Crianças' },
    ],
    galleryNote: 'Mais fotos dos jogos da base em breve.',
    cta: { title: 'Quer apoiar a base com a gente?', text: 'Chama no WhatsApp para saber dos próximos jogos e de como ajudar.', button: 'Quero apoiar a base', message: 'Olá, Rasta! Vim pelo site e quero apoiar a base do Gama com vocês.' },
  },
  {
    slug: PILLAR_SLUGS[3],
    number: '04',
    title: P[3]?.titulo ?? 'Shows e cultura',
    tagline: 'Cultura e lazer é revolução.',
    hero: { src: fotos.pilares[3]?.foto ?? '/fotos/pilar-shows-cultura.webp', alt: 'Integrantes da Rasta com a bandeira em evento cultural', position: 'center 35%' },
    intro: {
      heading: 'O reggae que nasceu com a Rasta',
      paragraphs: [
        'A Rasta nasceu da conexão do amor pelo Gama com os valores da cultura reggae. Por isso o movimento vai além dos 90 minutos: está nos shows, nos eventos culturais do Gama, na arte e na música.',
        'Bandeiras, adesivos e o mascote, o periquito do Gama com jeito de Zé Carioca, levam essa identidade para fora do estádio, junto com quem também acredita em paz nos estádios.',
      ],
    },
    values: ['Reggae', 'Arte', 'Música', 'Lazer'],
    stepsTitle: 'Onde a cultura da Rasta aparece',
    steps: [
      { icon: Music, title: 'Shows e eventos', text: 'A Rasta marca presença nos shows e eventos culturais do Gama.' },
      { icon: Mic, title: 'Rasta Cast', text: 'Participação no podcast, conversando sobre ideologias com diferentes movimentos rastas.' },
      { icon: MapPin, title: 'Rede nacional', text: 'Parte do Movimento Nacional Rastas & Reggae: de norte a sul, paz nos estádios.' },
      { icon: Palette, title: 'Arte e identidade', text: 'Faixas, adesivos e o mascote levam a cultura reggae para a rua.' },
    ],
    quote: { text: 'A Rasta nasceu para levar a cultura reggae aos estádios e mostrar que a arquibancada pode ser um espaço de paz, respeito.', author: 'Jamerson Abrantes, ao CidadeCULT (abril de 2026)' },
    gallery: [
      { src: fotos.pilares[3]?.foto ?? '/fotos/pilar-shows-cultura.webp', alt: 'Rasta com a bandeira em evento cultural', caption: 'Shows e eventos' },
      { src: '/fotos/pilar-shows-cultura.webp', alt: 'Rasta reunida com a faixa na entrada de evento', caption: 'Chegada no evento' },
      { src: '/hero/hero-grupo-1672.webp', alt: 'Pré-jogo Rasta do Gama, resenha e amizade', caption: 'Resenha e amizade' },
    ],
    galleryNote: 'Mais fotos e vídeos dos shows em breve.',
    cta: { title: 'Fique por dentro dos próximos eventos', text: 'Chama no WhatsApp para saber dos próximos shows e encontros da Rasta.', button: 'Quero saber dos eventos', message: 'Olá, Rasta! Vim pelo site e quero saber dos próximos shows e eventos.' },
  },
]

export const findPillar = (slug?: string) => PILLARS.find((p) => p.slug === slug)

function Hero({ pillar }: { pillar: Pillar }) {
  return (
    <section className="relative isolate flex min-h-[64vh] items-end overflow-hidden bg-[var(--color-black)] text-white md:min-h-[72vh]">
      <img src={pillar.hero.src} alt={pillar.hero.alt} className="absolute inset-0 -z-10 h-full w-full object-cover" style={{ objectPosition: pillar.hero.position }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--color-black)] via-[var(--color-black)]/55 to-black/20" aria-hidden="true" />
      <div className="mx-auto w-full max-w-[1200px] px-5 pb-12 pt-24 md:px-10 md:pb-16">
        <nav aria-label="Você está em" className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
          <Link to="/" className="hover:text-white">Início</Link> <span aria-hidden="true">/</span>{' '}
          <Link to="/#como-atuamos" className="hover:text-white">Como atuamos</Link>
        </nav>
        <p className="heading mt-6 text-6xl leading-none text-[var(--color-leaf)] md:text-8xl" aria-hidden="true">{pillar.number}</p>
        <h1 className="heading mt-2 text-5xl leading-[0.95] md:text-8xl">{pillar.title}</h1>
        <p className="mt-4 max-w-xl text-lg text-white/85 md:text-2xl">{pillar.tagline}</p>
        <span className="rasta-stripe mt-6 block w-28 rounded-full" aria-hidden="true" />
      </div>
    </section>
  )
}

function Intro({ pillar }: { pillar: Pillar }) {
  return (
    <section className="section-y">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-5 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:px-10">
        <div>
          <p className="eyebrow text-[var(--color-text-muted)]">Sobre esta frente</p>
          <h2 className="heading title-rule title-rule-left mt-3 text-4xl leading-[0.95] text-[var(--color-ink)] md:text-6xl">{pillar.intro.heading}</h2>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-[var(--color-text-muted)] md:pt-10">
          {pillar.intro.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ul className="flex flex-wrap gap-2 pt-2" aria-label="Valores">
            {pillar.values.map((v) => (
              <li key={v} className="rounded-full border border-[var(--color-brand)]/30 bg-[var(--color-alert)] px-4 py-1.5 text-sm font-semibold text-[var(--color-brand)]">
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Stats({ stats }: { stats: NonNullable<Pillar['stats']> }) {
  return (
    <section className="bg-[var(--color-black)] text-white">
      <dl className="mx-auto grid max-w-[1200px] divide-y divide-white/10 px-5 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-10">
        {stats.map((s) => (
          <div key={s.label} className="py-8 md:px-8 md:py-12 md:first:pl-0">
            <dt className="heading text-5xl text-[var(--color-sun)] md:text-6xl">{s.value}</dt>
            <dd className="mt-2 text-sm uppercase tracking-[0.08em] text-white/75">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Steps({ pillar }: { pillar: Pillar }) {
  const cols = pillar.steps.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
  return (
    <section className="section-y bg-[var(--color-bg-soft)]">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <p className="eyebrow text-[var(--color-text-muted)]">Na prática</p>
        <h2 className="heading title-rule title-rule-left mt-3 text-4xl text-[var(--color-ink)] md:text-5xl">{pillar.stepsTitle}</h2>
        <ol className={`mt-10 grid gap-4 sm:grid-cols-2 ${cols}`}>
          {pillar.steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative flex flex-col rounded-xl border-t-2 border-[var(--color-brand)] bg-white p-6 shadow-[0_4px_16px_rgba(8,61,33,0.05)]">
              <span className="absolute right-5 top-4 heading text-4xl text-[var(--color-border)]" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-alert)] text-[var(--color-brand)]" aria-hidden="true">
                <Icon size={22} />
              </span>
              <p className="heading mt-5 text-2xl text-[var(--color-ink)]">{title}</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-text-muted)]">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Quote({ quote }: { quote: NonNullable<Pillar['quote']> }) {
  return (
    <section className="section-y">
      <figure className="mx-auto max-w-[900px] px-5 text-center md:px-10">
        <span className="heading block text-7xl leading-none text-[var(--color-brand)]" aria-hidden="true">“</span>
        <blockquote className="heading -mt-4 text-3xl leading-tight text-[var(--color-ink)] md:text-5xl">{quote.text}</blockquote>
        <figcaption className="mt-5 text-sm uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{quote.author}</figcaption>
      </figure>
    </section>
  )
}

function Moments({ moments }: { moments: NonNullable<Pillar['moments']> }) {
  return (
    <section className="section-y bg-[var(--color-black)] text-white">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <p className="eyebrow text-[var(--color-leaf)]">Histórico</p>
        <h2 className="heading mt-3 text-4xl md:text-5xl">{moments.title}</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
          {moments.items.map((m) => (
            <li key={m.title} className="relative border-l-2 border-[var(--color-leaf)]/60 pl-5">
              <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[var(--color-sun)]" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-leaf)]">{m.date}</p>
              <p className="heading mt-2 text-2xl">{m.title}</p>
              <p className="mt-2 leading-relaxed text-white/80">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Gallery({ pillar }: { pillar: Pillar }) {
  const shots = pillar.gallery
  return (
    <section className="section-y">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <p className="eyebrow text-[var(--color-text-muted)]">Galeria</p>
        <h2 className="heading title-rule title-rule-left mt-3 text-4xl text-[var(--color-ink)] md:text-5xl">Registros da Rasta</h2>

        <div className={`mt-10 grid gap-3 md:gap-4 ${pillar.video ? 'lg:grid-cols-[340px_1fr] lg:items-start' : ''}`}>
          {pillar.video && (
            <div className="mx-auto w-full max-w-[340px]">
              <SocialVideo src={pillar.video.src} poster={pillar.video.poster} label={pillar.video.label} />
            </div>
          )}
          <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[230px] md:grid-cols-3 md:gap-4">
            {shots.map((shot, i) => (
              <figure
                key={shot.src + i}
                className={`group relative overflow-hidden rounded-lg bg-[var(--color-black)] ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
              >
                <img src={shot.src} alt={shot.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                {shot.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10 text-sm font-semibold text-white">
                    {shot.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
        {pillar.galleryNote && <p className="mt-4 text-sm text-[var(--color-text-muted)]">{pillar.galleryNote}</p>}
      </div>
    </section>
  )
}

function Cta({ pillar }: { pillar: Pillar }) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-brand)] text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-10 md:py-16">
        <div>
          <h2 className="heading text-4xl md:text-5xl">{pillar.cta.title}</h2>
          <p className="mt-3 max-w-xl text-white/85">{pillar.cta.text} Dúvidas também são respondidas por lá.</p>
        </div>
        <a href={whatsappLink(pillar.cta.message)} target="_blank" rel="noreferrer" className="btn-sun flex min-h-12 shrink-0 items-center gap-2 rounded px-7 text-sm">
          <MessageCircle size={18} /> {pillar.cta.button}
        </a>
      </div>
    </section>
  )
}

function OtherPillars({ current }: { current: string }) {
  const others = PILLARS.filter((p) => p.slug !== current)
  return (
    <section className="section-y">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <p className="eyebrow text-[var(--color-text-muted)]">Como atuamos</p>
        <h2 className="heading title-rule title-rule-left mt-3 text-4xl text-[var(--color-ink)] md:text-5xl">Conheça as outras frentes</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-3 md:gap-4">
          {others.map((p) => (
            <Link key={p.slug} to={`/como-atuamos/${p.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-black">
              <img src={p.hero.src} alt="" loading="lazy" className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-100" style={{ objectPosition: p.hero.position }} />
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" aria-hidden="true" />
              <span className="absolute inset-x-5 bottom-5 text-white">
                <span className="heading block text-sm text-[var(--color-leaf)]">{p.number}</span>
                <span className="heading flex items-center justify-between text-3xl">
                  {p.title} <ArrowRight size={20} className="transition group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-8 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <ShieldCheck size={16} className="text-[var(--color-brand)]" aria-hidden="true" /> Movimento popular e cultural · Igualdade, paz e amizade
        </p>
      </div>
    </section>
  )
}

export function PillarPage({ pillar }: { pillar: Pillar }) {
  return (
    <>
      <Hero pillar={pillar} />
      <Intro pillar={pillar} />
      {pillar.stats && <Stats stats={pillar.stats} />}
      <Steps pillar={pillar} />
      {pillar.quote && <Quote quote={pillar.quote} />}
      {pillar.moments && <Moments moments={pillar.moments} />}
      <Gallery pillar={pillar} />
      <Cta pillar={pillar} />
      <OtherPillars current={pillar.slug} />
    </>
  )
}
