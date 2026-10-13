// Roda as funções de /api no computador, para testar o painel sem publicar nada.
// Uso: node scripts/painel-local.mjs  (porta 3001; o `npm run dev` repassa /api para cá)
// Sem GITHUB_TOKEN, o painel grava direto nos arquivos do projeto. Variáveis em .env.painel.local.
import { existsSync, readFileSync } from 'node:fs'
import { createServer } from 'node:http'

const env = new URL('../.env.painel.local', import.meta.url)
if (existsSync(env))
  for (const linha of readFileSync(env, 'utf8').split(/\r?\n/)) {
    const m = linha.match(/^([A-Z_]+)=(.*)$/)
    if (m) process.env[m[1]] ??= m[2]
  }

createServer(async (req, res) => {
  const nome = new URL(req.url, 'http://x').pathname.match(/^\/api\/([a-z]+)$/)?.[1]
  if (!nome || !existsSync(new URL(`../api/${nome}.js`, import.meta.url))) {
    res.statusCode = 404
    return res.end()
  }
  const partes = []
  for await (const p of req) partes.push(p)
  try {
    req.body = partes.length ? JSON.parse(Buffer.concat(partes).toString('utf8')) : {}
  } catch {
    req.body = {}
  }
  const { default: handler } = await import(`../api/${nome}.js`)
  await handler(req, res)
}).listen(3001, () => console.log('API do painel em http://localhost:3001'))
