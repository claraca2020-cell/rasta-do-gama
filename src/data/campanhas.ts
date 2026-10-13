import campanhas from './campanhas.json'

// Campanhas e cupons: editados pelo painel (/admin), que grava src/data/campanhas.json.
// "faixa": aparece na faixa do topo do site. Só as campanhas ativas aparecem.
export type Campanha = { id: string; titulo: string; texto: string; cupom: string; ativa: boolean; faixa: boolean }

export const CAMPANHAS: readonly Campanha[] = (campanhas as Campanha[]).filter((c) => c.ativa)
export const CAMPANHA_FAIXA = CAMPANHAS.find((c) => c.faixa)
/** Cupom de primeira compra (botão da loja), quando a campanha estiver ativa. */
export const PRIMEIRA_COMPRA = CAMPANHAS.find((c) => c.id === 'primeira-compra')

export const mensagemCampanha = (c: Campanha) =>
  c.cupom ? `Olá, Rasta! Vim pelo site e quero usar o cupom ${c.cupom} (${c.titulo}).` : `Olá, Rasta! Vim pelo site e quero saber mais sobre: ${c.titulo}.`
