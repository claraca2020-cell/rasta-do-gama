import assinaturaBranca from '../assets/brand/assinatura-branca.webp'
import { CATEGORIES, categoryHref } from '../data/products'
import { trackEvent } from '../lib/analytics'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from '../lib/contact'
import { Link } from '../lib/Link'
import { InstagramIcon, WhatsAppIcon } from './SocialIcons'
import { INSTITUTIONAL_LINKS } from '../lib/nav'
import { Wordmark } from './Wordmark'

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="heading text-xl text-[var(--color-sun)]">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link to={link.href} className="text-sm text-white/80 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-[var(--color-black)] text-white">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-10 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:gap-12 md:py-12 md:px-10">
        <div>
          <Wordmark logoClassName="h-20" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/75">
            Movimento popular e cultural de torcedores do Gama. Igualdade, paz e amizade — liberdade pra torcer!
          </p>
        </div>
        <Column title="Institucional" links={INSTITUTIONAL_LINKS} />
        <Column title="Loja" links={[{ label: 'Todos os produtos', href: '/produtos' }, ...CATEGORIES.map((c) => ({ label: c, href: categoryHref(c) }))]} />
        <div>
          <p className="heading text-xl text-[var(--color-sun)]">Conecte-se conosco</p>
          <p className="mt-4 text-sm text-white/80">WhatsApp {WHATSAPP_DISPLAY}</p>
          <p className="text-sm text-white/80">{INSTAGRAM_HANDLE}</p>
          <div className="mt-4 flex gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label={`Instagram ${INSTAGRAM_HANDLE}`} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 hover:border-[var(--color-sun)] hover:text-[var(--color-sun)]">
              <InstagramIcon size={20} />
            </a>
            <a href={whatsappLink('Olá, Rasta! Vim pelo site.')} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${WHATSAPP_DISPLAY}`} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 hover:border-[var(--color-sun)] hover:text-[var(--color-sun)]">
              <WhatsAppIcon size={21} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-white/60 sm:flex-row md:px-10">
          <p>© {new Date().getFullYear()} Movimento Rasta do Gama · Gama – DF · Paz nos estádios</p>
          <img src={assinaturaBranca} alt="Assinatura" width={1672} height={941} loading="lazy" decoding="async" className="h-10 w-auto" />
        </div>
      </div>
    </footer>
  )
}

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink('Olá, Rasta! Vim pelo site.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a Rasta no WhatsApp"
      onClick={() => trackEvent('whatsapp_click', { source: 'flutuante' })}
      className="fixed right-5 bottom-5 z-[900] flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition-transform hover:scale-105"
    >
      <WhatsAppIcon size={30} />
    </a>
  )
}
