import { MapPin } from 'lucide-react'
import { InstagramIcon, WhatsAppIcon } from '../components/SocialIcons'
import { PageBanner } from '../components/PageBanner'
import { trackEvent } from '../lib/analytics'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from '../lib/contact'

const MAPS_EMBED_SRC = 'https://www.google.com/maps?q=Est%C3%A1dio+Bezerr%C3%A3o+Gama+DF&output=embed'

export function ContactPage() {
  return (
    <>
      <PageBanner kicker="Institucional" title="Fale conosco" />
      <section className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-20">
        <div>
          <h2 className="brush text-4xl md:text-5xl">Chama a Rasta!</h2>
          <p className="mt-4 text-[var(--color-text-muted)]">
            Pedidos, patrocínio de ações sociais, caravanas ou para fazer parte do movimento: o atendimento é pelo WhatsApp e pelo
            Instagram.
          </p>
          <ul className="mt-10 space-y-6">
            <li className="flex gap-4">
              <WhatsAppIcon className="mt-1 text-[var(--color-brand)]" size={24} />
              <div>
                <p className="heading text-sm">WhatsApp</p>
                <a
                  href={whatsappLink('Olá, Rasta! Vim pelo site.')}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent('whatsapp_click', { source: 'contato' })}
                  className="text-lg font-semibold text-[var(--color-brand)] hover:underline"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <InstagramIcon className="mt-1 text-[var(--color-brand)]" size={24} />
              <div>
                <p className="heading text-sm">Instagram</p>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-lg font-semibold text-[var(--color-brand)] hover:underline">
                  {INSTAGRAM_HANDLE}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <MapPin className="mt-1 shrink-0" size={24} />
              <div>
                <p className="heading text-sm">Onde estamos</p>
                <p>Estádio Walmir Campelo Bezerra (Bezerrão), arquibancada Norte, Gama – DF</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="overflow-hidden border-2 border-[var(--color-black)]">
          <iframe
            title="Localização do Estádio Bezerrão, no Gama – DF"
            src={MAPS_EMBED_SRC}
            className="h-[360px] w-full md:h-full md:min-h-[440px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  )
}
