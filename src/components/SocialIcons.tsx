import instagramIcon from '../assets/brand/icon-instagram.png'
import whatsappIcon from '../assets/brand/icon-whatsapp.png'

// Ícones oficiais (os mesmos do site da Saúde Fit, vault "16-Saúde fit gym/icone de redes sociais").
// Usados como máscara: a cor segue o texto (branco no rodapé verde, verde nas páginas claras).
function MaskIcon({ src, size, className = '' }: { src: string; size: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  )
}

export function InstagramIcon({ size = 24, className }: { size?: number; className?: string }) {
  return <MaskIcon src={instagramIcon} size={size} className={className} />
}

export function WhatsAppIcon({ size = 24, className }: { size?: number; className?: string }) {
  return <MaskIcon src={whatsappIcon} size={size} className={className} />
}
