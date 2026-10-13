// Conversa com as funções de /api (ver api/). Erros chegam já em português.
import type { Product } from '../data/products'
import type { Campanha } from '../data/campanhas'

export type ProdutoSalvo = Omit<Product, 'price' | 'badge'> & { price: string; badge: string }

export type FotoComPosicao = { foto: string; alt: string; posicao: number }
export type Polaroid = { foto: string; alt: string; legenda: string }
export interface FotosSite {
  banner: FotoComPosicao[]
  fundoPaginas: string
  quemSomos: { foto: string; alt: string }
  pilares: { titulo: string; foto: string; posicao: number }[]
  acaoSocial: Polaroid[]
  caravanas: Polaroid[]
}

export interface Contatos {
  whatsapp: string
  instagram: string
}

export interface Dados {
  versao: string
  produtos: ProdutoSalvo[]
  fotos: FotosSite
  campanhas: Campanha[]
  contatos: Contatos
}

export interface Quem {
  usuario: string
  nome: string
}

export class ErroApi extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function chamar<T>(rota: string, corpo?: unknown): Promise<T> {
  let r: Response
  try {
    r = await fetch(`/api/${rota}`, {
      method: corpo === undefined ? 'GET' : 'POST',
      credentials: 'same-origin',
      headers: corpo === undefined ? {} : { 'Content-Type': 'application/json', 'X-Painel': '1' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    })
  } catch {
    throw new ErroApi('Sem conexão com a internet. Confira o Wi-Fi ou os dados móveis e tente de novo.', 0)
  }
  const json = await r.json().catch(() => ({}))
  if (!r.ok) throw new ErroApi(json.erro || 'Algo deu errado. Tente de novo.', r.status)
  return json as T
}

export const api = {
  entrar: (usuario: string, senha: string) => chamar<Quem>('entrar', { usuario, senha }),
  sair: () => chamar('sair', {}),
  dados: () => chamar<Dados & { quem: Quem }>('dados'),
  foto: (base64: string, tipo: 'webp' | 'jpeg', pasta: 'loja' | 'fotos') => chamar<{ caminho: string; blob: string }>('foto', { base64, tipo, pasta }),
  publicar: (versao: string, dados: Partial<Omit<Dados, 'versao'>>, fotos: { caminho: string; blob: string }[], resumo: string) =>
    chamar<Partial<Dados> & { versao: string }>('publicar', { versao, dados, fotos, resumo }),
}
