import { trackEvent } from '../lib/analytics'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from '../lib/contact'
import { Link } from '../lib/Link'
import { InstagramIcon, WhatsAppIcon } from './SocialIcons'
import assinaturaRecortada from '../assets/brand/assinatura-branca-trim.webp'
import logoPapagaio from '../assets/brand/logo-papagaio-sm.webp'
import { Wordmark } from './Wordmark'

// Rodapé no modelo do site da Saúde Fit (celular e computador): logo à esquerda, Instagram e WhatsApp no meio,
// assinatura em amarelo à direita e o copyright centralizado embaixo.
// Celular: espaço igual entre os três (justify-between). Computador: ícones centralizados na página.
export function Footer() {
  return (
    <footer className="bg-[var(--color-black)] text-white" style={{ borderTop: '3px solid #12a150', boxShadow: '0 -3px 0 #ffcd00, 0 -6px 0 #e0342b' }}>
      <div className="mx-auto max-w-[1100px] px-5 pt-9 pb-24 md:px-12 md:pt-12 md:pb-10">
        <div className="flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
          <Link to="/" aria-label="Rasta do Gama — página inicial" className="md:justify-self-start">
            <img src={logoPapagaio} alt="" width={166} height={180} loading="lazy" className="h-14 w-auto md:hidden" />
            <Wordmark className="hidden md:flex" logoClassName="h-20" />
          </Link>
          <div className="flex items-center gap-5 md:gap-10">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label={`Instagram ${INSTAGRAM_HANDLE}`} className="flex h-11 w-11 items-center justify-center transition-colors hover:text-[var(--color-sun)]">
              <InstagramIcon size={34} />
            </a>
            <a
              href={whatsappLink('Olá, Rasta! Vim pelo site.')}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp ${WHATSAPP_DISPLAY}`}
              onClick={() => trackEvent('whatsapp_click', { source: 'footer' })}
              className="flex h-11 w-11 items-center justify-center transition-colors hover:text-[var(--color-sun)]"
            >
              <WhatsAppIcon size={34} />
            </a>
          </div>
          {/* assinatura em amarelo: a imagem (recortada, sem bordas vazias) vira máscara pintada com --color-sun */}
          <span
            role="img"
            aria-label="Assinatura"
            className="block h-12 bg-[var(--color-sun)] md:h-20 md:justify-self-end"
            style={{
              aspectRatio: '1346 / 828',
              WebkitMask: `url(${assinaturaRecortada}) center / contain no-repeat`,
              mask: `url(${assinaturaRecortada}) center / contain no-repeat`,
            }}
          />
        </div>
        <p className="mt-7 text-center text-[0.72rem] text-white/60 md:mt-8 md:text-sm">
          © {new Date().getFullYear()} Movimento Rasta do Gama, Gama – DF
        </p>
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
