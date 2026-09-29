import { PageBanner } from '../components/PageBanner'
import { INSTAGRAM_HANDLE, WHATSAPP_DISPLAY } from '../lib/contact'

// Respostas baseadas nos formulários e posts da Rasta. Entrega/retirada: confirmar com o cliente.
const GROUPS = [
  {
    id: 'como-comprar',
    title: 'Como comprar',
    items: [
      {
        q: 'Como faço meu pedido?',
        a: 'Escolha os produtos, selecione modelo, tamanho e quantidade e toque em "Adicionar à sacola". Na sacola, toque em "Finalizar pedido no WhatsApp": a mensagem chega pronta para a Rasta.',
      },
      { q: 'Quais tamanhos estão disponíveis?', a: 'Camisas e casacos: P, M, G, GG, XG, 3G e 4G, além de infantil. Meias: do 35 ao 43.' },
      { q: 'Tem modelo feminino e infantil?', a: 'Sim. A camisa tem corte BabyLook e versão infantil, e o casaco corta-vento tem modelos masculino, feminino e infantil.' },
    ],
  },
  {
    id: 'pagamento',
    title: 'Formas de pagamento',
    items: [
      { q: 'Quais são as formas de pagamento?', a: 'Pix (a chave é enviada pelo WhatsApp), débito presencialmente ou crédito presencialmente com a taxa da maquininha.' },
      { q: 'Preciso enviar comprovante?', a: `Sim. Depois do Pix, envie o comprovante pelo WhatsApp ${WHATSAPP_DISPLAY}.` },
    ],
  },
  {
    id: 'entrega',
    title: 'Entrega e retirada',
    items: [{ q: 'Como recebo meu produto?', a: 'A retirada ou entrega é combinada com a Rasta pelo WhatsApp depois do pedido.' }],
  },
  {
    id: 'movimento',
    title: 'O movimento',
    items: [
      { q: 'Como faço parte do movimento?', a: `Chame no WhatsApp ou no direct do Instagram ${INSTAGRAM_HANDLE} e venha para a arquibancada Norte do Bezerrão.` },
      { q: 'Como posso patrocinar uma ação social?', a: 'A partir de R$ 50 sua marca apoia a ação e recebe divulgação nos perfis da Rasta. Chame no WhatsApp para combinar.' },
    ],
  },
]

export function FaqPage() {
  return (
    <>
      <PageBanner kicker="Institucional" title="Dúvidas" />
      <section className="mx-auto max-w-[900px] px-5 py-14 md:px-10 md:py-20">
        {GROUPS.map((group) => (
          <div key={group.id} id={group.id} className="mb-12 scroll-mt-32">
            <h2 className="heading border-b-4 border-[var(--color-black)] pb-3 text-xl md:text-2xl">{group.title}</h2>
            <div className="divide-y divide-[var(--color-border)]">
              {group.items.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    {item.q}
                    <span className="text-2xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
