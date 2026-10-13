import { randomBytes } from 'node:crypto'
import { sessao } from './_lib/auth.js'
import { aceitar, corpo, erro, responder } from './_lib/http.js'
import { SemToken, repo } from './_lib/repo.js'

// Banner chega com até 2400 px (fica maior que as outras fotos).
const LIMITE = 5 * 1024 * 1024
const ehWebp = (b) => b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP'
const ehJpeg = (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff

// Recebe uma foto já reduzida pelo navegador (WebP, ou JPEG no Safari antigo) e guarda no repositório, ainda sem publicar.
// Devolve o endereço que a foto terá no site; ela entra no ar junto com o próximo "Salvar".
// Fotos de produto vão para /loja/painel/<mês>/; as do site (banner, quem somos, pilares…) para /fotos/painel/<mês>/.
export default async function handler(req, res) {
  if (!aceitar(req, res, 'POST')) return
  if (!sessao(req)) return erro(res, 401, 'Entre com seu usuário e senha.')
  const { base64, pasta } = corpo(req)
  const buffer = Buffer.from(String(base64 || ''), 'base64')
  const ext = ehWebp(buffer) ? 'webp' : ehJpeg(buffer) ? 'jpg' : null
  if (!ext) return erro(res, 400, 'Formato de foto não reconhecido.')
  if (buffer.length > LIMITE) return erro(res, 413, 'Foto grande demais.')
  const mes = new Date().toISOString().slice(0, 7)
  const nome = `${Date.now().toString(36)}-${randomBytes(4).toString('hex')}.${ext}`
  const caminho = `/${pasta === 'loja' ? 'loja' : 'fotos'}/painel/${mes}/${nome}`
  try {
    responder(res, 200, { caminho, blob: await repo().guardarFoto(buffer) })
  } catch (e) {
    if (e instanceof SemToken) return erro(res, 503, 'O painel ainda não foi ligado ao GitHub (falta o GITHUB_TOKEN na Vercel). Avise quem cuida do site.')
    console.error(e)
    erro(res, 502, 'Não foi possível enviar a foto. Tente de novo.')
  }
}
