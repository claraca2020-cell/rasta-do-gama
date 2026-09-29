import { trackEvent } from '../lib/analytics'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from '../lib/contact'
import { Link } from '../lib/Link'
import { WhatsAppIcon } from './SocialIcons'
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
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
              className="transition-opacity hover:opacity-80 inline-flex items-center justify-center"
              style={{ background: 'transparent' }}
            >
              <svg width="36" height="36" viewBox="0 0 256 256" fill="url(#instagramGradient)">
                <defs>
                  <linearGradient id="instagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#12a150" />
                    <stop offset="50%" stopColor="#ffcd00" />
                    <stop offset="100%" stopColor="#e0342b" />
                  </linearGradient>
                </defs>
                <path d="M128 24c28.7 0 32 0.1 43.3 0.6c11 0.5 18.5 2.3 25 4.9c6.8 2.6 12.6 6.2 18.1 11.7c5.5 5.5 9.1 11.3 11.7 18.1c2.6 6.5 4.4 14 4.9 25c0.5 11.3 0.6 14.6 0.6 43.3s-0.1 32-0.6 43.3c-0.5 11-2.3 18.5-4.9 25c-2.6 6.8-6.2 12.6-11.7 18.1c-5.5 5.5-11.3 9.1-18.1 11.7c-6.5 2.6-14 4.4-25 4.9c-11.3 0.5-14.6 0.6-43.3 0.6s-32-0.1-43.3-0.6c-11-0.5-18.5-2.3-25-4.9c-6.8-2.6-12.6-6.2-18.1-11.7c-5.5-5.5-9.1-11.3-11.7-18.1c-2.6-6.5-4.4-14-4.9-25c-0.5-11.3-0.6-14.6-0.6-43.3s0.1-32 0.6-43.3c0.5-11 2.3-18.5 4.9-25c2.6-6.8 6.2-12.6 11.7-18.1c5.5-5.5 11.3-9.1 18.1-11.7c6.5-2.6 14-4.4 25-4.9C96 24.1 99.3 24 128 24zm0 41.6c-23.5 0-42.7 19.2-42.7 42.7c0 23.5 19.2 42.7 42.7 42.7c23.5 0 42.7-19.2 42.7-42.7c0-23.5-19.2-42.7-42.7-42.7zm0 70.4c-15.3 0-27.7-12.4-27.7-27.7c0-15.3 12.4-27.7 27.7-27.7c15.3 0 27.7 12.4 27.7 27.7c0 15.3-12.4 27.7-27.7 27.7zm54.6-71.5c0 5.5-4.5 10-10 10c-5.5 0-10-4.5-10-10c0-5.5 4.5-10 10-10c5.5 0 10 4.5 10 10z" />
              </svg>
            </a>
            <a
              href={whatsappLink('Olá, Rasta! Vim pelo site.')}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp ${WHATSAPP_DISPLAY}`}
              onClick={() => trackEvent('whatsapp_click', { source: 'footer' })}
              className="transition-opacity hover:opacity-80 inline-flex items-center justify-center"
              style={{ background: 'transparent' }}
            >
              <svg width="36" height="36" viewBox="0 0 256 256" fill="url(#whatsappGradient)">
                <defs>
                  <linearGradient id="whatsappGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#12a150" />
                    <stop offset="50%" stopColor="#ffcd00" />
                    <stop offset="100%" stopColor="#e0342b" />
                  </linearGradient>
                </defs>
                <path d="M218 82q0 30.6-15 59t-41 49q-26 20-58 20a105 105 0 0 1-70-26L20 225l48-140A103 103 0 0 1 128 20q32 0 58 20t41 49q15 28.4 15 59z" />
                <path fill="white" d="M96 100c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8zm32 0c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8zm32 0c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" />
              </svg>
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
