import contatos from '../data/contatos.json'

// Contatos oficiais: editados pelo painel (/admin), que grava src/data/contatos.json.
const digitos = contatos.whatsapp.replace(/\D/g, '')
export const WHATSAPP_NUMBER = digitos.startsWith('55') ? digitos : `55${digitos}`
export const WHATSAPP_DISPLAY = contatos.whatsapp
export const INSTAGRAM_URL = contatos.instagram
export const INSTAGRAM_HANDLE = `@${contatos.instagram.replace(/\/+$/, '').split('/').pop()}`

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
