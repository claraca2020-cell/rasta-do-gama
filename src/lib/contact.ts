// Contatos oficiais levantados no Instagram/Google Forms da Rasta (28/09/2026).
// Confirmar com o cliente antes de publicar.
export const WHATSAPP_NUMBER = '5561981442152'
export const WHATSAPP_DISPLAY = '(61) 98144-2152'
export const INSTAGRAM_URL = 'https://www.instagram.com/rastadogamaoficial/'
export const INSTAGRAM_HANDLE = '@rastadogamaoficial'

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
