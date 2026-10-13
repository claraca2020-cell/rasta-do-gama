// Junta duas edições da mesma lista feitas ao mesmo tempo (ex.: uma pessoa muda o estoque de um produto
// enquanto outra cadastra outro). Compara item por item, pela chave (produtos: "slug"; campanhas: "id"):
//   base  = lista que estava no repositório quando a tela abriu
//   deles = lista que está no repositório agora (alguém salvou depois)
//   meus  = lista que esta tela quer gravar
// Só dá conflito quando as duas pessoas mexeram no MESMO item de jeitos diferentes.
import { Conflito } from './repo.js'

const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export function mesclarLista(base, deles, meus, chave) {
  const porChave = (lista) => new Map(lista.map((i) => [i[chave], i]))
  const B = porChave(base)
  const T = porChave(deles)
  const M = porChave(meus)
  const resultado = []

  // Itens novos que a outra pessoa cadastrou (não existiam na base e não estão nesta tela) vão no começo.
  for (const i of deles) if (!B.has(i[chave]) && !M.has(i[chave])) resultado.push(i)

  // Na ordem desta tela.
  for (const meu of meus) {
    const b = B.get(meu[chave])
    const t = T.get(meu[chave])
    if (!b) {
      if (t && !igual(t, meu)) throw new Conflito()
      resultado.push(meu)
    } else if (t) {
      if (igual(meu, b)) resultado.push(t) // só a outra pessoa mexeu
      else if (igual(t, b) || igual(t, meu)) resultado.push(meu) // só esta tela mexeu (ou as duas igual)
      else throw new Conflito() // as duas mexeram no mesmo item
    } else if (!igual(meu, b)) {
      throw new Conflito() // a outra pessoa removeu um item que esta tela editou
    }
  }

  // Itens que esta tela removeu: se a outra pessoa editou nesse meio-tempo, é conflito.
  for (const b of base) if (!M.has(b[chave]) && T.has(b[chave]) && !igual(T.get(b[chave]), b)) throw new Conflito()

  return resultado
}
