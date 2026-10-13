import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { Campanha } from '../data/campanhas'
import type { Contexto } from './Painel'
import { Aviso, Campo, classeCampo, Secao } from './ui'

function Interruptor({ ligado, aoMudar, rotulo, dica }: { ligado: boolean; aoMudar: (v: boolean) => void; rotulo: string; dica: string }) {
  return (
    <button type="button" role="switch" aria-checked={ligado} onClick={() => aoMudar(!ligado)} className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-line)] bg-white p-3 text-left">
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${ligado ? 'bg-[var(--color-brand)]' : 'bg-[#c9d3c8]'}`}>
        <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-[left] ${ligado ? 'left-6' : 'left-1'}`} />
      </span>
      <span>
        <span className="block font-semibold text-[var(--color-navy)]">{rotulo}</span>
        <span className="block text-[13px] leading-snug text-[var(--color-muted)]">{dica}</span>
      </span>
    </button>
  )
}

export function CampanhasAba({ ctx }: { ctx: Contexto }) {
  const [lista, setLista] = useState<Campanha[]>(ctx.dados.campanhas)
  const mudou = JSON.stringify(lista) !== JSON.stringify(ctx.dados.campanhas)
  useEffect(() => setLista(ctx.dados.campanhas), [ctx.dados.campanhas])

  const set = (n: number, campo: Partial<Campanha>) =>
    setLista((l) =>
      l.map((c, i) => {
        if (i === n) return { ...c, ...campo }
        // Só uma campanha aparece na faixa do site: ligar numa desliga nas outras.
        return campo.faixa ? { ...c, faixa: false } : c
      }),
    )

  const nova = () => {
    let id = `campanha-${Date.now().toString(36)}`
    while (lista.some((c) => c.id === id)) id += '1'
    setLista((l) => [{ id, titulo: '', texto: '', cupom: '', ativa: true, faixa: false }, ...l])
  }

  const salvar = () => {
    if (lista.some((c) => !c.titulo.trim())) return window.alert('Toda campanha precisa de um título.')
    void ctx.publicar({ campanhas: lista }, 'atualiza campanhas')
  }

  return (
    <div className="space-y-4">
      <button type="button" onClick={nova} className="btn btn-green w-full justify-center py-3.5 text-base sm:w-auto">
        <Plus className="size-5" aria-hidden /> Nova campanha
      </button>
      <Aviso tipo="info">
        Campanhas ativas com cupom aparecem na página de cada produto. A que estiver na <strong>faixa do site</strong> aparece em destaque, em amarelo, no topo das páginas. A campanha “primeira compra” também liga o botão de cupom da loja.
      </Aviso>

      {lista.map((c, n) => (
        <Secao
          key={c.id}
          titulo={c.titulo || 'Nova campanha'}
          acao={
            <button
              type="button"
              onClick={() => window.confirm(`Apagar a campanha "${c.titulo || 'sem título'}"?`) && setLista((l) => l.filter((_, i) => i !== n))}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#b42318] hover:bg-[#fdecec]"
            >
              <Trash2 className="size-4" aria-hidden /> Apagar
            </button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo="Título" dica="Curto. Ex.: 5% off na 1ª compra, Frete grátis no Gama">
              <input className={classeCampo} value={c.titulo} onChange={(e) => set(n, { titulo: e.target.value })} maxLength={60} />
            </Campo>
            <Campo rotulo="Cupom (opcional)" dica="Só letras e números. Ex.: RASTA10">
              <input className={`${classeCampo} uppercase`} value={c.cupom} onChange={(e) => set(n, { cupom: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })} maxLength={20} />
            </Campo>
            <Campo rotulo="Texto" dica="Uma frase explicando a campanha." largo>
              <input className={classeCampo} value={c.texto} onChange={(e) => set(n, { texto: e.target.value })} maxLength={160} />
            </Campo>
            <Interruptor ligado={c.ativa} aoMudar={(ativa) => set(n, { ativa, ...(ativa ? {} : { faixa: false }) })} rotulo={c.ativa ? 'Ativa' : 'Pausada'} dica="Pausada some do site, mas fica guardada aqui." />
            <Interruptor ligado={c.faixa} aoMudar={(faixa) => set(n, { faixa, ...(faixa ? { ativa: true } : {}) })} rotulo="Faixa do site" dica="Destaque amarelo no topo das páginas (só uma por vez)." />
          </div>
        </Secao>
      ))}
      {!lista.length && <Aviso tipo="info">Nenhuma campanha. Clique em “Nova campanha”.</Aviso>}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-line)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl gap-3 px-3 py-3 sm:px-4">
          <button type="button" disabled={!mudou} onClick={() => setLista(ctx.dados.campanhas)} className="btn btn-ghost flex-1 justify-center py-3.5 text-base disabled:opacity-40 sm:flex-none sm:px-8">
            Desfazer
          </button>
          <button type="button" onClick={salvar} disabled={!mudou || ctx.salvando} className="btn btn-green flex-[2] justify-center py-3.5 text-base disabled:opacity-40 sm:ml-auto sm:flex-none sm:px-10">
            {ctx.salvando ? 'Salvando…' : 'Salvar e publicar'}
          </button>
        </div>
      </div>
    </div>
  )
}
