import { sessao } from './_lib/auth.js'
import { aceitar, erro, responder } from './_lib/http.js'
import { SemToken, repo } from './_lib/repo.js'

// Quem está logado + os dados atuais do site (direto do repositório, não da versão publicada).
export default async function handler(req, res) {
  if (!aceitar(req, res, 'GET')) return
  const quem = sessao(req)
  if (!quem) return erro(res, 401, 'Entre com seu usuário e senha.')
  try {
    responder(res, 200, { quem, ...(await repo().ler()) })
  } catch (e) {
    if (e instanceof SemToken) return erro(res, 503, 'O painel ainda não foi ligado ao GitHub (falta o GITHUB_TOKEN na Vercel). Avise quem cuida do site.')
    console.error(e)
    erro(res, 502, 'Não foi possível carregar os dados agora. Tente de novo em instantes.')
  }
}
