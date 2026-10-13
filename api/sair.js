import { cookieSair } from './_lib/auth.js'
import { aceitar, responder } from './_lib/http.js'

export default function handler(req, res) {
  if (!aceitar(req, res, 'POST')) return
  res.setHeader('Set-Cookie', cookieSair)
  responder(res, 200, { ok: true })
}
