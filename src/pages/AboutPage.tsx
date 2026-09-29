import adesivosArte from '../assets/photos/social-bandeira-rasta.webp'
import { PageBanner } from '../components/PageBanner'
import { Watermark } from '../components/Decor'
import { whatsappLink } from '../lib/contact'

// Página "Quem somos" no formato da referência: banner → título em pincel → texto em tópicos + imagem rasgada.
// Todos os fatos vêm do Instagram da Rasta e de matérias (CidadeCULT, Jornal de Brasília) — ver nota 12 no Obsidian.
const ACTIONS = [
  { date: '10/10/2026', text: 'Dia das Crianças na Cáritas Paroquial São José (Santa Maria), com a Gama Stickers e parceiros' },
  { date: '15/09/2026', text: 'Doação de roupas e agasalhos ao Recanto Cristo Vivo (Valparaíso)' },
  { date: 'Set/2026', text: 'Campanha Setembro Amarelo: "Ligue 188, sua vida importa"' },
  { date: '2026', text: 'Projeto de abafadores de ruído para pessoas autistas no Bezerrão' },
  { date: 'Sempre', text: 'Campanhas de paz nos estádios, contra a violência e a discriminação' },
]

const SUPPORTERS = ['Audity Centro Auditivo', 'Dr. Honda', 'Sebo do Gama', 'Agência Planaltour', 'Bonde Guaronha']

export function AboutPage() {
  return (
    <>
      <PageBanner kicker="Institucional" title="Quem somos" />

      <section className="mx-auto grid max-w-[1200px] section-y gap-8 px-5 md:grid-cols-[1.2fr_0.8fr] md:gap-12 md:px-10">
        <div>
          <h2 className="heading title-rule title-rule-left text-5xl md:text-6xl">Mais que torcida, um movimento</h2>

          <div className="mt-6 space-y-4 leading-relaxed">
            <p>
              O <strong>Movimento Rasta do Gama</strong> é um movimento popular e cultural de torcedores da Sociedade Esportiva do
              Gama. Une o amor pelo clube aos valores da cultura reggae: <strong>igualdade, paz e amizade</strong>.
            </p>
            <p>
              <em>Principal atividade:</em> apoiar o Gama na arquibancada Norte do Bezerrão, com bandeiras, faixas, música e
              caravanas para os jogos fora de casa.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Onde estamos:</strong> Estádio Walmir Campelo Bezerra (Bezerrão), arquibancada Norte, Gama – DF
              </li>
              <li>
                <strong>Compromisso:</strong> não compactuamos com violência nem discriminação
              </li>
              <li>
                <strong>Lema:</strong> Igualdade · Paz · Amizade — Liberdade pra torcer!
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

      <section id="acoes-sociais" className="section-y bg-[var(--color-black)] text-white">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <div className="relative">
            <Watermark dark>Corrente do bem</Watermark>
            <h2 className="heading relative text-2xl md:text-3xl">Ações sociais</h2>
          </div>
          <ul className="mt-8 divide-y divide-white/15 border-y border-white/15">
            {ACTIONS.map((action) => (
              <li key={action.text} className="grid gap-1 py-5 md:grid-cols-[160px_1fr] md:gap-8">
                <span className="font-bold uppercase tracking-[0.08em] text-[var(--color-sun)]">{action.date}</span>
                <span className="text-white/90">{action.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="heading text-lg">Patrocinadores do Dia das Crianças 2026</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {SUPPORTERS.map((name) => (
                  <li key={name} className="border border-white/30 px-4 py-2 text-sm font-semibold">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
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
