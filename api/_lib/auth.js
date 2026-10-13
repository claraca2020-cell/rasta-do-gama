// Login do painel: usuários e hashes de senha ficam na variável ADMIN_USERS da Vercel
// (gerados por scripts/criar-acesso.mjs); a sessão é um cookie assinado com SESSAO_SEGREDO.
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto'

const COOKIE = 'rasta_painel'
const DIAS = 7

// ADMIN_USERS aceita o JSON direto ou em base64 (mais seguro de colar em painéis e terminais).
export function usuarios() {
  const bruto = String(process.env.ADMIN_USERS || '').trim()
  for (const texto of [bruto, Buffer.from(bruto, 'base64').toString('utf8')]) {
    try {
      const lista = JSON.parse(texto)
      if (Array.isArray(lista)) return lista
    } catch {
      // tenta o próximo formato
    }
  }
  return []
}

function segredo() {
  const s = process.env.SESSAO_SEGREDO
  if (!s || s.length < 32) throw new Error('SESSAO_SEGREDO não configurado')
  return s
}

const assinar = (texto) => createHmac('sha256', segredo()).update(texto).digest('base64url')

function iguais(a, b) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

/** Hash no formato "salt:hash" (hex), scrypt N=16384. */
export function conferirSenha(senha, hash) {
  const [salt, h] = String(hash || '').split(':')
  if (!salt || !h) return false
  const calculado = scryptSync(String(senha), Buffer.from(salt, 'hex'), 64)
  const esperado = Buffer.from(h, 'hex')
  return esperado.length === calculado.length && timingSafeEqual(calculado, esperado)
}

export function acharUsuario(login) {
  const l = String(login || '').trim().toLowerCase()
  return usuarios().find((u) => String(u.usuario).toLowerCase() === l) || null
}

export function cookieEntrar(usuario) {
  const dados = Buffer.from(JSON.stringify({ u: usuario, exp: Date.now() + DIAS * 864e5 })).toString('base64url')
  return `${COOKIE}=${dados}.${assinar(dados)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${DIAS * 86400}`
}

export const cookieSair = `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`

/** Usuário logado ({ usuario, nome }) ou null. */
export function sessao(req) {
  const bruto = String(req.headers.cookie || '')
    .split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE}=`))
  if (!bruto) return null
  const [dados, assinatura] = bruto.slice(COOKIE.length + 1).split('.')
  if (!dados || !assinatura || !iguais(assinatura, assinar(dados))) return null
  try {
    const { u, exp } = JSON.parse(Buffer.from(dados, 'base64url').toString('utf8'))
    if (!exp || exp < Date.now()) return null
    const usuario = acharUsuario(u)
    return usuario ? { usuario: usuario.usuario, nome: usuario.nome || usuario.usuario } : null
  } catch {
    return null
  }
}
