import { acharUsuario, conferirSenha, cookieEntrar, usuarios } from './_lib/auth.js'
import { aceitar, corpo, erro, responder } from './_lib/http.js'

const espera = (ms) => new Promise((r) => setTimeout(r, ms))

export default async function handler(req, res) {
  if (!aceitar(req, res, 'POST')) return
  const { usuario, senha } = corpo(req)
  // Atraso fixo: deixa tentativa de adivinhar senha lenta e não revela se o usuário existe.
  await espera(600)
  const u = acharUsuario(usuario)
  if (!u || !conferirSenha(String(senha || '').trim(), u.hash)) {
    // Diagnóstico sem dados sensíveis: quantos acessos foram lidos e se o usuário existe.
    console.warn(`login recusado: ${usuarios().length} acessos configurados, usuário ${u ? 'existe' : 'não existe'}`)
    return erro(res, 401, 'Usuário ou senha incorretos.')
  }
  res.setHeader('Set-Cookie', cookieEntrar(u.usuario))
  responder(res, 200, { usuario: u.usuario, nome: u.nome || u.usuario })
}
