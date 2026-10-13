// Onde o painel lê e grava os dados do site.
// Produção: commits no GitHub (GITHUB_TOKEN com acesso só a este repositório); cada commit publica na Vercel.
// Local (sem GITHUB_TOKEN): grava direto nos arquivos do projeto, para testar com scripts/painel-local.mjs.
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ARQUIVOS = {
  produtos: 'src/data/produtos.json',
  fotos: 'src/data/fotos.json',
  campanhas: 'src/data/campanhas.json',
  contatos: 'src/data/contatos.json',
}

export class Conflito extends Error {}

const json = (dados) => JSON.stringify(dados, null, 1) + '\n'
/** Caminho público (/loja/x.webp) → arquivo no repositório (public/loja/x.webp). */
export const arquivoDaFoto = (caminho) => `public${caminho}`

// ---------- GitHub ----------
const REPO = () => process.env.GITHUB_REPO || 'claraca2020-cell/rasta-do-gama'
const BRANCH = () => process.env.GITHUB_BRANCH || 'main'

async function gh(caminho, opcoes = {}) {
  const r = await fetch(`https://api.github.com/repos/${REPO()}${caminho}`, {
    ...opcoes,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })
  if (!r.ok) {
    const e = new Error(`GitHub ${r.status} em ${caminho}: ${(await r.text()).slice(0, 300)}`)
    e.status = r.status
    throw e
  }
  return r.json()
}

async function arvore(commitSha) {
  const commit = await gh(`/git/commits/${commitSha}`)
  const t = await gh(`/git/trees/${commit.tree.sha}?recursive=1`)
  return { treeSha: commit.tree.sha, itens: new Map(t.tree.filter((i) => i.type === 'blob').map((i) => [i.path, i.sha])) }
}

async function lerBlob(sha) {
  const b = await gh(`/git/blobs/${sha}`)
  return JSON.parse(Buffer.from(b.content, 'base64').toString('utf8'))
}

const github = {
  async ler() {
    const head = (await gh(`/git/ref/heads/${BRANCH()}`)).object.sha
    const { itens } = await arvore(head)
    const dados = { versao: head }
    for (const [nome, caminho] of Object.entries(ARQUIVOS)) dados[nome] = await lerBlob(itens.get(caminho))
    return dados
  },

  async guardarFoto(buffer) {
    const b = await gh('/git/blobs', { method: 'POST', body: JSON.stringify({ content: buffer.toString('base64'), encoding: 'base64' }) })
    return b.sha
  },

  /** Um arquivo de dados como estava num commit antigo (base para juntar edições simultâneas). */
  async lerEm(versao, nome) {
    const { itens } = await arvore(versao)
    return lerBlob(itens.get(ARQUIVOS[nome]))
  },

  /** Dados atuais + arquivos existentes, para o publicar() calcular o que apagar. */
  async estado() {
    const head = (await gh(`/git/ref/heads/${BRANCH()}`)).object.sha
    const t = await arvore(head)
    const dados = {}
    for (const [nome, caminho] of Object.entries(ARQUIVOS)) dados[nome] = await lerBlob(t.itens.get(caminho))
    return { head, dados, existe: (arquivo) => t.itens.has(arquivo), ...t }
  },

  async publicar({ versao, estado, escrever, fotos, apagar, mensagem }) {
    // Se alguém salvou depois que esta tela abriu, só aceita se os arquivos que estamos gravando não mudaram.
    if (estado.head !== versao) {
      const antes = await arvore(versao)
      for (const nome of Object.keys(escrever))
        if (antes.itens.get(ARQUIVOS[nome]) !== estado.itens.get(ARQUIVOS[nome])) throw new Conflito()
    }
    const tree = [
      ...Object.entries(escrever).map(([nome, dados]) => ({ path: ARQUIVOS[nome], mode: '100644', type: 'blob', content: json(dados) })),
      ...fotos.map((f) => ({ path: arquivoDaFoto(f.caminho), mode: '100644', type: 'blob', sha: f.blob })),
      ...apagar.map((arquivo) => ({ path: arquivo, mode: '100644', type: 'blob', sha: null })),
    ]
    const novaArvore = await gh('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: estado.treeSha, tree }) })
    const commit = await gh('/git/commits', { method: 'POST', body: JSON.stringify({ message: mensagem, tree: novaArvore.sha, parents: [estado.head] }) })
    try {
      await gh(`/git/refs/heads/${BRANCH()}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false }) })
    } catch (e) {
      if (e.status === 422) throw new Conflito()
      throw e
    }
    return commit.sha
  },
}

// ---------- Local ----------
const RAIZ = fileURLToPath(new URL('../../', import.meta.url))
const fotosPendentes = new Map()
let versaoLocal = 1

const local = {
  async ler() {
    const dados = { versao: `local-${versaoLocal}` }
    for (const [nome, caminho] of Object.entries(ARQUIVOS)) dados[nome] = JSON.parse(readFileSync(join(RAIZ, caminho), 'utf8'))
    return dados
  },
  async guardarFoto(buffer) {
    const id = `local-${fotosPendentes.size + 1}-${Date.now()}`
    fotosPendentes.set(id, buffer)
    return id
  },
  async lerEm() {
    throw new Conflito()
  },
  async estado() {
    const { versao, ...dados } = await local.ler()
    return { head: versao, dados, existe: (arquivo) => existsSync(join(RAIZ, arquivo)) }
  },
  async publicar({ versao, estado, escrever, fotos, apagar, mensagem }) {
    if (versao !== estado.head) throw new Conflito()
    for (const [nome, dados] of Object.entries(escrever)) writeFileSync(join(RAIZ, ARQUIVOS[nome]), json(dados))
    for (const f of fotos) {
      const destino = join(RAIZ, arquivoDaFoto(f.caminho))
      mkdirSync(dirname(destino), { recursive: true })
      writeFileSync(destino, fotosPendentes.get(f.blob) ?? Buffer.alloc(0))
    }
    for (const arquivo of apagar) unlinkSync(join(RAIZ, arquivo))
    console.log(`[painel local] ${mensagem}`)
    return `local-${++versaoLocal}`
  },
}

export class SemToken extends Error {}

export function repo() {
  if (process.env.GITHUB_TOKEN) return github
  // Na Vercel o modo local não existe (os arquivos são só leitura): falta configurar o token.
  if (process.env.VERCEL) throw new SemToken('GITHUB_TOKEN não configurado na Vercel')
  return local
}
