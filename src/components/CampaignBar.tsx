import { Ticket } from 'lucide-react'
import { CAMPANHA_FAIXA, mensagemCampanha } from '../data/campanhas'
import { trackEvent } from '../lib/analytics'
import { whatsappLink } from '../lib/contact'

// Faixa da campanha marcada no painel como "aparece na faixa do site" (só uma por vez).
// Na página inicial fica logo abaixo do banner; nas outras, logo abaixo do cabeçalho.
export function CampaignBar() {
  if (!CAMPANHA_FAIXA) return null
  const c = CAMPANHA_FAIXA
  return (
    <aside aria-label="Campanha" className="bg-[var(--color-sun)] text-[var(--color-black)]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-4 gap-y-2 px-5 py-3 text-center md:px-10">
        <p className="font-semibold">
          <span className="heading mr-2 text-lg">{c.titulo}</span>
          {c.texto}
          {c.cupom && (
            <span className="ml-2 inline-block rounded border-2 border-dashed border-[var(--color-black)] px-2 py-0.5 text-sm font-bold tracking-[0.08em]">
              {c.cupom}
            </span>
          )}
        </p>
        <a
          href={whatsappLink(mensagemCampanha(c))}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent('whatsapp_click', { source: `campanha-${c.id}` })}
          className="btn-black inline-flex min-h-11 items-center gap-2 rounded px-5 text-sm"
        >
          <Ticket size={16} /> {c.cupom ? 'Usar o cupom' : 'Quero saber'}
        </a>
      </div>
    </aside>
  )
}
