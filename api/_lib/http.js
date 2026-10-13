// Utilitários das funções do painel (/api). Arquivos começando com "_" não viram rotas na Vercel.

export function responder(res, status, corpo) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(corpo))
}

export const erro = (res, status, mensagem) => responder(res, status, { erro: mensagem })

/**
 * Só aceita o método certo e, nos POST, JSON com o cabeçalho X-Painel (o navegador não manda
 * esse cabeçalho de outro site sem CORS; junto com o cookie SameSite=Strict, evita CSRF).
 */
export function aceitar(req, res, metodo) {
  if (req.method !== metodo) {
    res.setHeader('Allow', metodo)
    erro(res, 405, 'Método não permitido.')
    return false
  }
  if (metodo === 'POST' && (req.headers['x-painel'] !== '1' || !String(req.headers['content-type'] || '').includes('application/json'))) {
    erro(res, 400, 'Requisição inválida.')
    return false
  }
  return true
}

/** Corpo JSON: a Vercel já entrega em req.body; o servidor local (scripts/painel-local.mjs) também. */
export const corpo = (req) => (req.body && typeof req.body === 'object' ? req.body : {})
