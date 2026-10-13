import { sessao } from './_lib/auth.js'
import { aceitar, corpo, erro, responder } from './_lib/http.js'
import { Conflito, SemToken, arquivoDaFoto, repo } from './_lib/repo.js'
import { Invalido, validarCampanhas, validarContatos, validarFotos, validarProdutos } from './_lib/validar.js'
import { mesclarLista } from './_lib/mesclar.js'

const VALIDAR = { produtos: validarProdutos, fotos: validarFotos, campanhas: validarCampanhas, contatos: validarContatos }
// Listas que dá para juntar quando duas pessoas salvam ao mesmo tempo (pela chave de cada item).
const MESCLAVEIS = { produtos: 'slug', campanhas: 'id' }

const fotosDoSite = (f) => [f.fundoPaginas, f.quemSomos.foto, ...[...f.banner, ...f.pilares, ...f.acaoSocial, ...f.caravanas].map((x) => x.foto)]
const fotosUsadas = (d) => new Set([...d.produtos.flatMap((p) => p.images ?? []), ...fotosDoSite(d.fotos)])

// Grava as mudanças do painel num único commit (dados + fotos novas − fotos enviadas pelo painel que ninguém usa mais).
export default async function handler(req, res) {
  if (!aceitar(req, res, 'POST')) return
  const quem = sessao(req)
  if (!quem) return erro(res, 401, 'Sua sessão expirou. Entre de novo.')
  const { versao, dados = {}, fotos = [], resumo } = corpo(req)
  try {
    const escrever = {}
    for (const nome of Object.keys(VALIDAR)) if (dados[nome] !== undefined) escrever[nome] = VALIDAR[nome](dados[nome])
    if (!Object.keys(escrever).length) return erro(res, 400, 'Nada para salvar.')

    const r = repo()
    const estado = await r.estado()
    // Alguém salvou depois que esta tela abriu: junta as mudanças de itens diferentes em vez de recusar.
    let base = String(versao || '')
    const nomes = Object.keys(escrever)
    if (estado.head !== base && nomes.length === 1 && MESCLAVEIS[nomes[0]]) {
      const nome = nomes[0]
      const v = VALIDAR[nome]
      // as listas passam pela mesma limpeza antes de comparar, para não acusar conflito à toa
      escrever[nome] = v(mesclarLista(v(await r.lerEm(base, nome)), v(estado.dados[nome]), escrever[nome], MESCLAVEIS[nome]))
      base = estado.head
    }
    const depois = { ...estado.dados, ...escrever }
    const usadas = fotosUsadas(depois)
    // Fotos enviadas nesta tela que continuam em uso entram no commit; as descartadas são ignoradas.
    const novas = (Array.isArray(fotos) ? fotos : []).filter((f) => usadas.has(f?.caminho) && f?.blob)
    // Só são apagadas fotos que o próprio painel enviou (pastas "painel"); as originais do site ficam.
    const apagar = [...fotosUsadas(estado.dados)]
      .filter((c) => !usadas.has(c))
      .map(arquivoDaFoto)
      .filter((a, n, l) => /^public\/(loja|fotos)\/painel\//.test(a) && l.indexOf(a) === n && estado.existe(a))

    const mensagem = `Painel: ${String(resumo || 'atualização').slice(0, 120)} (por ${quem.nome})`
    const nova = await r.publicar({ versao: base, estado, escrever, fotos: novas, apagar, mensagem })
    responder(res, 200, { versao: nova, ...escrever })
  } catch (e) {
    if (e instanceof Invalido) return erro(res, 422, e.message)
    if (e instanceof Conflito) return erro(res, 409, 'Outra pessoa salvou uma alteração agora há pouco. Clique em "Recarregar" e faça sua mudança de novo.')
    if (e instanceof SemToken) return erro(res, 503, 'O painel ainda não foi ligado ao GitHub (falta o GITHUB_TOKEN na Vercel). Avise quem cuida do site.')
    console.error(e)
    erro(res, 502, 'Não foi possível salvar agora. Tente de novo em instantes.')
  }
}
