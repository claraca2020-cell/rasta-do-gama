import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowUp, EyeOff, ExternalLink, ImagePlus, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { CATEGORIES, type Category, type Stock } from '../data/products'
import type { ProdutoSalvo } from './api'
import { FotosOrdenaveis } from './FotosOrdenaveis'
import { slugDoNome } from './fotos'
import type { Contexto } from './Painel'
import { Aviso, Campo, classeCampo, Secao } from './ui'

const ESTOQUES: { id: Stock; nome: string; dica: string }[] = [
  { id: 'disponivel', nome: 'Disponível', dica: 'Pode comprar normalmente.' },
  { id: 'encomenda', nome: 'Sob encomenda', dica: 'Pode pedir; o prazo é combinado no WhatsApp.' },
  { id: 'esgotado', nome: 'Esgotado', dica: 'O botão de compra vira "Avise-me quando chegar".' },
]
const corEstoque: Record<Stock, string> = {
  disponivel: 'bg-[#dff2e5] text-[#0a4f2a]',
  encomenda: 'bg-[#fff4cc] text-[#6b5000]',
  esgotado: 'bg-[#10231a] text-white',
}

function produtoNovo(): ProdutoSalvo {
  return {
    slug: '',
    name: '',
    category: 'Acessórios',
    price: '',
    unit: 'por unidade',
    badge: '',
    description: '',
    features: [],
    options: [],
    images: [],
    stock: 'disponivel',
    quantity: null,
    visible: true,
  }
}

export function ProdutosAba({ ctx }: { ctx: Contexto }) {
  const [editando, setEditando] = useState<{ produto: ProdutoSalvo; novo: boolean } | null>(null)
  const [busca, setBusca] = useState('')
  const lista = ctx.dados.produtos

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return lista
    return lista.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q))
  }, [lista, busca])

  if (editando)
    return (
      <FormProduto
        ctx={ctx}
        inicial={editando.produto}
        novo={editando.novo}
        aoSair={() => {
          setEditando(null)
          window.scrollTo(0, 0)
        }}
      />
    )

  const salvarLista = (produtos: ProdutoSalvo[], resumo: string) => ctx.publicar({ produtos }, resumo)

  const mudarEstoque = (p: ProdutoSalvo, stock: Stock) =>
    void salvarLista(
      lista.map((x) => (x.slug === p.slug ? { ...x, stock } : x)),
      `estoque de ${p.name}: ${ESTOQUES.find((e) => e.id === stock)?.nome}`,
    )

  const mover = (n: number, para: number) => {
    const nova = [...lista]
    const [p] = nova.splice(n, 1)
    nova.splice(para, 0, p)
    void salvarLista(nova, `muda a ordem da loja (${p.name})`)
  }

  const remover = (p: ProdutoSalvo) => {
    if (!window.confirm(`Remover "${p.name}" da loja?\n\nSe quiser só esconder por um tempo, use "Mostrar no site: não" dentro do produto.`)) return
    void salvarLista(lista.filter((x) => x.slug !== p.slug), `remove produto ${p.name}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => setEditando({ produto: produtoNovo(), novo: true })} className="btn btn-green justify-center py-3.5 text-base sm:order-2">
          <Plus className="size-5" aria-hidden /> Adicionar produto
        </button>
        <label className="relative flex-1">
          <span className="sr-only">Buscar produto</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-[var(--color-muted)]" aria-hidden />
          <input className={`${classeCampo} pl-11`} placeholder="Buscar por nome ou categoria" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </label>
      </div>

      <p className="px-1 text-sm text-[var(--color-muted)]">
        {filtrados.length === lista.length ? `${lista.length} produtos` : `${filtrados.length} de ${lista.length} produtos`} · a ordem aqui é a ordem da loja. Mude o estoque direto na lista.
      </p>

      <ul className="space-y-3">
        {filtrados.map((p) => {
          const n = lista.indexOf(p)
          return (
            <li key={p.slug} className="flex gap-3 rounded-2xl bg-white p-3 shadow-[0_1px_3px_rgb(0_0_0/0.06)] sm:gap-4">
              <button type="button" onClick={() => setEditando({ produto: p, novo: false })} className="relative shrink-0" aria-label={`Editar ${p.name}`}>
                <img src={ctx.verFoto(p.images[0])} alt="" loading="lazy" className="size-24 rounded-xl bg-white object-contain ring-1 ring-[var(--color-line)]" />
                {!p.visible && (
                  <span className="absolute inset-x-1 bottom-1 flex items-center justify-center gap-1 rounded-md bg-black/70 py-0.5 text-[11px] font-semibold text-white">
                    <EyeOff className="size-3" aria-hidden /> Oculto
                  </span>
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-[var(--color-navy)]">{p.name}</p>
                <p className="truncate text-sm text-[var(--color-muted)]">
                  {p.category} · {p.price ? `R$ ${p.price}` : 'Consulte'}
                  {p.quantity !== null && ` · ${p.quantity} em estoque`}
                </p>
                <label className="mt-1.5 inline-flex items-center gap-2">
                  <span className="sr-only">Estoque de {p.name}</span>
                  <select
                    value={p.stock}
                    disabled={ctx.salvando}
                    onChange={(e) => mudarEstoque(p, e.target.value as Stock)}
                    className={`h-9 rounded-full px-3 text-sm font-bold ${corEstoque[p.stock]} disabled:opacity-60`}
                  >
                    {ESTOQUES.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nome}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="mt-2 flex flex-wrap gap-x-1 gap-y-1">
                  <button type="button" onClick={() => setEditando({ produto: p, novo: false })} className="flex items-center gap-1.5 rounded-lg bg-[var(--color-navy)] px-3 py-1.5 text-sm font-semibold text-white">
                    <Pencil className="size-3.5" aria-hidden /> Editar
                  </button>
                  {p.visible && (
                    <a href={`/produtos/${p.slug}`} target="_blank" rel="noopener" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--color-navy)] hover:bg-[var(--color-sand)]">
                      <ExternalLink className="size-3.5" aria-hidden /> Ver no site
                    </a>
                  )}
                  <button type="button" disabled={ctx.salvando} onClick={() => remover(p)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#b42318] hover:bg-[#fdecec] disabled:opacity-50">
                    <Trash2 className="size-3.5" aria-hidden /> Remover
                  </button>
                </div>
              </div>
              {!busca && (
                <div className="flex flex-col">
                  <button type="button" disabled={n === 0 || ctx.salvando} onClick={() => mover(n, n - 1)} className="grid size-10 place-items-center rounded-lg hover:bg-[var(--color-sand)] disabled:opacity-25" aria-label={`Subir ${p.name}`}>
                    <ArrowUp className="size-5" />
                  </button>
                  <button type="button" disabled={n === lista.length - 1 || ctx.salvando} onClick={() => mover(n, n + 1)} className="grid size-10 place-items-center rounded-lg hover:bg-[var(--color-sand)] disabled:opacity-25" aria-label={`Descer ${p.name}`}>
                    <ArrowDown className="size-5" />
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      {!filtrados.length && <Aviso tipo="info">Nenhum produto encontrado com “{busca}”.</Aviso>}
    </div>
  )
}

// ---------- Formulário ----------

/** "64,9" → "64,90"; "1299" → "1.299,00"; vazio → "" (Consulte). */
function precoFormatado(t: string) {
  const limpo = t.replace(/[^\d,]/g, '')
  if (!limpo) return ''
  const [inteiro, centavos = ''] = limpo.split(',')
  const n = Number(inteiro || '0')
  return `${n.toLocaleString('pt-BR')},${(centavos + '00').slice(0, 2)}`
}

function Chips({ itens, aoMudar, placeholder, max, rotulo }: { itens: readonly string[]; aoMudar: (v: string[]) => void; placeholder: string; max: number; rotulo: string }) {
  const [novo, setNovo] = useState('')
  const incluir = () => {
    const v = novo.trim()
    if (v && !itens.includes(v)) aoMudar([...itens, v])
    setNovo('')
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {itens.map((c) => (
          <span key={c} className="flex items-center gap-1 rounded-full bg-[var(--color-sand)] py-1 pr-1 pl-3 text-sm">
            {c}
            <button type="button" onClick={() => aoMudar(itens.filter((x) => x !== c))} className="grid size-6 place-items-center rounded-full hover:bg-white" aria-label={`Tirar ${c}`}>
              <X className="size-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          className={classeCampo}
          aria-label={rotulo}
          placeholder={placeholder}
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              incluir()
            }
          }}
          maxLength={max}
        />
        <button type="button" onClick={incluir} className="btn btn-navy shrink-0 px-4">
          Incluir
        </button>
      </div>
    </div>
  )
}

function FormProduto({ ctx, inicial, novo, aoSair }: { ctx: Contexto; inicial: ProdutoSalvo; novo: boolean; aoSair: () => void }) {
  const [p, setP] = useState<ProdutoSalvo>(inicial)
  const [enviando, setEnviando] = useState<{ feitas: number; total: number } | null>(null)
  const [erro, setErro] = useState('')
  const arquivo = useRef<HTMLInputElement>(null)
  const mudou = JSON.stringify(p) !== JSON.stringify(inicial)

  // Fechar ou recarregar a aba com mudanças não salvas: o navegador pergunta antes.
  useEffect(() => {
    if (!mudou && !enviando) return
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', avisar)
    return () => window.removeEventListener('beforeunload', avisar)
  }, [mudou, enviando])

  const set = <K extends keyof ProdutoSalvo>(k: K, v: ProdutoSalvo[K]) => setP((x) => ({ ...x, [k]: v }))

  const adicionarFotos = async (arquivos: FileList | null) => {
    if (!arquivos?.length) return
    const lista = [...arquivos].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { numeric: true }))
    setErro('')
    setEnviando({ feitas: 0, total: lista.length })
    for (const [n, a] of lista.entries()) {
      try {
        const caminho = await ctx.enviarFoto(a, 'loja', 1200)
        setP((x) => ({ ...x, images: [...x.images, caminho] }))
      } catch (e) {
        setErro((e as Error).message)
      }
      setEnviando({ feitas: n + 1, total: lista.length })
    }
    setEnviando(null)
    if (arquivo.current) arquivo.current.value = ''
  }

  const salvar = async () => {
    setErro('')
    if (!p.name.trim()) return setErro('Preencha o nome do produto.')
    if (p.options.some((o) => !o.label.trim() || !o.values.length)) return setErro('Cada opção precisa de um nome (ex.: Tamanho) e pelo menos um valor (ex.: P, M, G).')
    if (!p.images.length && !window.confirm('Este produto está sem fotos. Salvar assim mesmo?')) return
    const outros = ctx.dados.produtos.filter((x) => x.slug !== inicial.slug).map((x) => x.slug)
    const final = { ...p, slug: novo ? slugDoNome(p.name, outros) : p.slug, price: precoFormatado(p.price) }
    const produtos = novo ? [final, ...ctx.dados.produtos] : ctx.dados.produtos.map((x) => (x.slug === inicial.slug ? final : x))
    if (await ctx.publicar({ produtos }, `${novo ? 'novo produto' : 'edita produto'} ${final.name}`)) aoSair()
  }

  const cancelar = () => {
    if (!mudou || window.confirm('Sair sem salvar? As mudanças feitas aqui serão perdidas.')) aoSair()
  }

  const setOpcao = (n: number, o: { label: string; values: readonly string[] }) => set('options', p.options.map((x, i) => (i === n ? o : x)))

  return (
    <div className="space-y-4">
      <button type="button" onClick={cancelar} className="flex items-center gap-2 px-1 py-1 text-[15px] font-semibold text-[var(--color-navy)]">
        <ArrowLeft className="size-4" aria-hidden /> Voltar para a lista
      </button>
      <h1 className="heading px-1 text-4xl text-[var(--color-navy)]">{novo ? 'Novo produto' : 'Editar produto'}</h1>

      {erro && (
        <Aviso tipo="erro" aoFechar={() => setErro('')}>
          {erro}
        </Aviso>
      )}

      <Secao
        numero={1}
        titulo="Fotos"
        acao={
          <button type="button" onClick={() => arquivo.current?.click()} disabled={!!enviando} className="btn btn-green px-4 py-2 text-sm disabled:opacity-60">
            <ImagePlus className="size-4" aria-hidden /> Adicionar fotos
          </button>
        }
      >
        <input ref={arquivo} type="file" accept="image/*" multiple className="hidden" onChange={(e) => adicionarFotos(e.target.files)} />
        {enviando && (
          <Aviso tipo="info">
            Enviando foto {Math.min(enviando.feitas + 1, enviando.total)} de {enviando.total}… Não feche esta tela.
          </Aviso>
        )}
        {!p.images.length && !enviando && (
          <button
            type="button"
            onClick={() => arquivo.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-line)] py-10 text-[var(--color-muted)] hover:border-[var(--color-brand)]"
          >
            <ImagePlus className="size-8" aria-hidden />
            Toque aqui para escolher as fotos do produto
          </button>
        )}
        <FotosOrdenaveis fotos={[...p.images]} verFoto={ctx.verFoto} aoMudar={(fotos) => set('images', fotos)} />
        {p.images.length > 1 && <p className="mt-3 text-[13px] text-[var(--color-muted)]">A primeira foto é a capa. Arraste para mudar a ordem (no celular, segure a foto um instante e arraste). Fotos com fundo branco ficam melhores na loja.</p>}
      </Secao>

      <Secao numero={2} titulo="Informações">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Nome do produto" largo>
            <input className={classeCampo} value={p.name} onChange={(e) => set('name', e.target.value)} maxLength={100} placeholder="Ex.: Boné Five Panel Rasta" />
          </Campo>
          <Campo rotulo="Categoria">
            <select className={classeCampo} value={p.category} onChange={(e) => set('category', e.target.value as Category)}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Campo>
          <Campo rotulo="Preço (R$)" dica="Ex.: 64,90. Em branco aparece “Consulte”.">
            <input className={classeCampo} inputMode="decimal" value={p.price} onChange={(e) => set('price', e.target.value)} onBlur={() => set('price', precoFormatado(p.price))} placeholder="64,90" />
          </Campo>
          <Campo rotulo="Unidade" dica="Ex.: por unidade, por par, pack com 4">
            <input className={classeCampo} value={p.unit} onChange={(e) => set('unit', e.target.value)} maxLength={40} />
          </Campo>
          <Campo rotulo="Selo (opcional)" dica="Etiqueta na foto. Ex.: Novo, Lançamento, Pré-venda">
            <input className={classeCampo} value={p.badge} onChange={(e) => set('badge', e.target.value)} maxLength={24} />
          </Campo>
        </div>
      </Secao>

      <Secao numero={3} titulo="Estoque">
        <div className="grid gap-2 sm:grid-cols-3">
          {ESTOQUES.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => set('stock', e.id)}
              aria-pressed={p.stock === e.id}
              className={`rounded-xl border-2 p-3 text-left ${p.stock === e.id ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white' : 'border-[var(--color-line)] bg-white text-[var(--color-ink)]'}`}
            >
              <span className="block font-bold">{e.nome}</span>
              <span className={`mt-0.5 block text-[13px] leading-snug ${p.stock === e.id ? 'text-white/80' : 'text-[var(--color-muted)]'}`}>{e.dica}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Quantidade em estoque (opcional)" dica="Com 5 ou menos, o site mostra “Últimas unidades”. Em branco, não mostra número.">
            <input
              className={classeCampo}
              inputMode="numeric"
              value={p.quantity ?? ''}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, '')
                set('quantity', d ? Math.min(99999, Number(d)) : null)
              }}
              placeholder="Ex.: 12"
            />
          </Campo>
          <Campo rotulo="Mostrar no site?">
            <div className="grid grid-cols-2 gap-2">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => set('visible', v)}
                  aria-pressed={p.visible === v}
                  className={`rounded-xl border-2 py-3 text-base font-semibold ${p.visible === v ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white' : 'border-[var(--color-line)] bg-white text-[var(--color-ink)]'}`}
                >
                  {v ? 'Sim' : 'Não (oculto)'}
                </button>
              ))}
            </div>
          </Campo>
        </div>
      </Secao>

      <Secao numero={4} titulo="Opções para o cliente escolher">
        <p className="-mt-2 mb-3 text-[13px] text-[var(--color-muted)]">Ex.: Tamanho (P, M, G…), Modelo (Masculino, Feminino). Sem opções, o cliente só escolhe a quantidade.</p>
        <div className="space-y-4">
          {p.options.map((o, n) => (
            <div key={n} className="rounded-xl border border-[var(--color-line)] p-3">
              <div className="mb-2 flex gap-2">
                <input className={classeCampo} value={o.label} onChange={(e) => setOpcao(n, { ...o, label: e.target.value })} maxLength={30} placeholder="Nome da opção (ex.: Tamanho)" aria-label="Nome da opção" />
                <button type="button" onClick={() => set('options', p.options.filter((_, i) => i !== n))} className="grid size-12 shrink-0 place-items-center rounded-xl text-[#b42318] hover:bg-[#fdecec]" aria-label={`Tirar a opção ${o.label}`}>
                  <Trash2 className="size-5" />
                </button>
              </div>
              <Chips itens={o.values} aoMudar={(values) => setOpcao(n, { ...o, values })} placeholder="Valor (ex.: GG)" max={20} rotulo={`Valores de ${o.label || 'opção'}`} />
            </div>
          ))}
          {p.options.length < 4 && (
            <button type="button" onClick={() => set('options', [...p.options, { label: '', values: [] }])} className="btn btn-ghost text-[var(--color-navy)]">
              <Plus className="size-4" aria-hidden /> Adicionar opção
            </button>
          )}
        </div>
      </Secao>

      <Secao numero={5} titulo="Descrição e destaques">
        <textarea className={`${classeCampo} min-h-32 leading-relaxed`} value={p.description} onChange={(e) => set('description', e.target.value)} maxLength={2000} placeholder="Como é o produto, material, para que serve…" aria-label="Descrição" />
        <span className="mt-4 mb-1.5 block text-[15px] font-semibold text-[var(--color-navy)]">Destaques (aparecem com ✓ na página do produto)</span>
        <Chips itens={p.features} aoMudar={(features) => set('features', features)} placeholder="Ex.: 100% algodão" max={80} rotulo="Novo destaque" />
      </Secao>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-line)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl gap-3 px-3 py-3 sm:px-4">
          <button type="button" onClick={cancelar} className="btn btn-ghost flex-1 justify-center py-3.5 text-base sm:flex-none sm:px-8">
            Cancelar
          </button>
          <button type="button" onClick={salvar} disabled={ctx.salvando || !!enviando} className="btn btn-green flex-[2] justify-center py-3.5 text-base disabled:opacity-60 sm:ml-auto sm:flex-none sm:px-10">
            {ctx.salvando ? 'Salvando…' : 'Salvar e publicar'}
          </button>
        </div>
      </div>
    </div>
  )
}
