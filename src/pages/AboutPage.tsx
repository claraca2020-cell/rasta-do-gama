import mascote from '../assets/brand/mascote-periquito.webp'
import adesivosArte from '../assets/photos/social-bandeira-rasta.webp'
import { PageBanner } from '../components/PageBanner'
import { Watermark } from '../components/Decor'
import { SOCIAL_ACTIONS } from '../data/social'
import { whatsappLink } from '../lib/contact'

// Página "Quem somos" no formato da referência: banner → título em pincel → texto em tópicos + imagem rasgada.
// Todos os fatos vêm do Instagram da Rasta e de matérias (CidadeCULT, Jornal de Brasília) — ver nota 12 no Obsidian.
// Ações e datas enviadas pela Rasta (05/10/2026); a lista de patrocinadores saiu a pedido deles.
const ACTIONS = [
  ...SOCIAL_ACTIONS.map((a) => ({ date: a.date, text: `${a.title}: ${a.text}` })),
  { date: 'Sempre', text: 'Campanhas de paz nos estádios, contra a violência e a discriminação' },
]

export function AboutPage() {
  return (
    <>
      <PageBanner kicker="Institucional" title="Quem somos" />

      <section className="mx-auto grid max-w-[1200px] section-y gap-8 px-5 md:grid-cols-[1.2fr_0.8fr] md:gap-12 md:px-10">
        <div>
          <h2 className="heading title-rule title-rule-left text-5xl md:text-6xl">Movimento popular e cultural</h2>

          <div className="mt-6 space-y-4 leading-relaxed">
            <p>
              A <strong>Rasta do Gama</strong> nasceu da conexão do amor pelo clube e os valores da cultura reggae, sendo criada em
              2026 por amigos e amantes da <strong>Sociedade Esportiva do Gama</strong>. Nossos valores: <strong>igualdade, paz e amizade</strong>.
            </p>
            <p>
              <em>Principal atividade:</em> apoiar o Gama no Bezerrão, com bandeiras, faixas, música e caravanas para os jogos
              fora de casa. Aonde o Gama for, a gente está.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Onde estamos:</strong> Estádio Walmir Campelo Bezerra (Bezerrão), Gama – DF
              </li>
              <li>
                <strong>Compromisso:</strong> não compactuamos com violência nem discriminação
              </li>
              <li>
                <strong>Lema:</strong> Igualdade · Paz · Amizade — Liberdade para torcer!
              </li>
              <li>
                <strong>Momento:</strong> em 2026 o Gama conquistou o acesso à Série C, e a Rasta cresceu junto na arquibancada e
                nas redes
              </li>
            </ul>

            <blockquote className="border-l-4 border-[var(--color-brand)] pl-5 text-lg font-medium italic">
              “A Rasta nasceu para levar a cultura reggae aos estádios e mostrar que a arquibancada pode ser um espaço de paz,
              respeito.”
              <footer className="mt-2 text-sm not-italic text-[var(--color-text-muted)]">
                Jamerson Abrantes, ao CidadeCULT (abril de 2026)
              </footer>
            </blockquote>
          </div>
        </div>

        <div className="md:pt-16">
          <div className="rounded-2xl bg-[var(--color-brand)] p-6 shadow-[0_20px_40px_rgba(8,61,33,0.25)]">
            <img src={adesivosArte} alt="Integrantes da Rasta com a bandeira Igualdade, Paz e Amizade" className="w-full rounded-lg" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section-y bg-[var(--color-bg-soft)]">
        <div className="mx-auto grid max-w-[1100px] items-center gap-8 px-5 md:grid-cols-[0.6fr_1.4fr] md:gap-12 md:px-10">
          <img src={mascote} alt="Mascote da Rasta: o periquito do Gama com boné e moletom verde" width={700} height={875} className="mx-auto w-48 rounded-2xl md:w-64" loading="lazy" />
          <div>
            <p className="eyebrow text-[var(--color-text-muted)]">Nosso mascote</p>
            <h2 className="heading title-rule title-rule-left mt-3 text-4xl md:text-5xl">O periquito com jeito gamense</h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--color-text-muted)]">
              Nosso mascote, além de ser o periquito do Gama, veio com a representação do Zé Carioca, que representa a
              personificação estereotipada do Brasil e do brasileiro. Mas com o nosso jeito gamense de ser.
            </p>
          </div>
        </div>
      </section>

      <section id="acoes-sociais" className="section-y bg-[var(--color-black)] text-white">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <div className="relative">
            <Watermark dark>Corrente do bem</Watermark>
            <h2 className="heading relative text-2xl md:text-3xl">Ações sociais</h2>
          </div>
          <ul className="mt-8 divide-y divide-white/15 border-y border-white/15">
            {ACTIONS.map((action) => (
              <li key={action.text} className="grid gap-1 py-5 md:grid-cols-[160px_1fr] md:gap-8">
                <span className="font-bold uppercase tracking-[0.08em] text-[var(--color-leaf)]">{action.date}</span>
                <span className="text-white/90">{action.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-4 md:mt-10 md:flex-row md:items-center md:justify-between">
            <p className="heading text-lg">Quer ajudar a próxima ação?</p>
            <a
              href={whatsappLink('Olá, Rasta! Vim pelo site e quero patrocinar a ação social. Como funciona?')}
              target="_blank"
              rel="noreferrer"
              className="btn-brand flex min-h-12 items-center justify-center px-7 text-sm"
            >
              Seja patrocinador · a partir de R$ 50
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
