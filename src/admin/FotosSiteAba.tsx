import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Camera, ImagePlus, Trash2 } from 'lucide-react'
import type { FotosSite, Polaroid } from './api'
import type { Contexto } from './Painel'
import { Aviso, Campo, classeCampo, Secao } from './ui'

const MAX_BANNER = 6

/** Botão que escolhe uma foto no aparelho, envia e devolve o endereço dela. */
function TrocarFoto({ ctx, maximo, aoTrocar, rotulo = 'Trocar foto' }: { ctx: Contexto; maximo: number; aoTrocar: (caminho: string) => void; rotulo?: string }) {
  const arquivo = useRef<HTMLInputElement>(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const escolher = async (f: File | undefined) => {
    if (!f) return
    setErro('')
    setEnviando(true)
    try {
      aoTrocar(await ctx.enviarFoto(f, 'fotos', maximo))
    } catch (e) {
      setErro((e as Error).message)
    }
    setEnviando(false)
    if (arquivo.current) arquivo.current.value = ''
  }
  return (
    <div>
      <button type="button" onClick={() => arquivo.current?.click()} disabled={enviando} className="btn btn-navy px-4 py-2 text-sm disabled:opacity-60">
        <Camera className="size-4" aria-hidden /> {enviando ? 'Enviando…' : rotulo}
      </button>
      <input ref={arquivo} type="file" accept="image/*" className="hidden" onChange={(e) => escolher(e.target.files?.[0])} />
      {erro && <p className="mt-1 text-sm text-[#b42318]">{erro}</p>}
    </div>
  )
}

/** Controle do enquadramento: qual altura da foto fica visível quando ela é cortada. */
function Enquadramento({ valor, aoMudar }: { valor: number; aoMudar: (v: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-[13px] font-semibold text-[var(--color-navy)]">
        <span>Enquadramento</span>
        <span className="font-normal text-[var(--color-muted)]">{valor < 34 ? 'mostra mais o alto' : valor > 66 ? 'mostra mais a parte de baixo' : 'centro'}</span>
      </span>
      <input type="range" min={0} max={100} step={5} value={valor} onChange={(e) => aoMudar(Number(e.target.value))} className="w-full accent-[var(--color-brand)]" aria-label="Enquadramento da foto (alto, centro ou parte de baixo)" />
    </label>
  )
}

export function FotosSiteAba({ ctx }: { ctx: Contexto }) {
  const [f, setF] = useState<FotosSite>(ctx.dados.fotos)
  const mudou = JSON.stringify(f) !== JSON.stringify(ctx.dados.fotos)

  // Depois de salvar (ou recarregar), a tela passa a mostrar o que está no site.
  useEffect(() => setF(ctx.dados.fotos), [ctx.dados.fotos])
  useEffect(() => {
    if (!mudou) return
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', avisar)
    return () => window.removeEventListener('beforeunload', avisar)
  }, [mudou])

  const setBanner = (n: number, campo: Partial<FotosSite['banner'][number]>) => setF((x) => ({ ...x, banner: x.banner.map((b, i) => (i === n ? { ...b, ...campo } : b)) }))
  const moverBanner = (n: number, para: number) =>
    setF((x) => {
      const banner = [...x.banner]
      const [b] = banner.splice(n, 1)
      banner.splice(para, 0, b)
      return { ...x, banner }
    })
  const setPolaroid = (lista: 'acaoSocial' | 'caravanas', n: number, campo: Partial<Polaroid>) =>
    setF((x) => ({ ...x, [lista]: x[lista].map((p, i) => (i === n ? { ...p, ...campo } : p)) }))

  const salvar = () => {
    if (f.banner.some((b) => !b.alt.trim())) return window.alert('Escreva a descrição de cada foto do banner (ajuda quem usa leitor de tela e o Google).')
    void ctx.publicar({ fotos: f }, 'atualiza fotos do site')
  }

  const polaroids = (lista: 'acaoSocial' | 'caravanas') => (
    <div className="grid gap-4 sm:grid-cols-2">
      {f[lista].map((p, n) => (
        <div key={n} className="space-y-3 rounded-xl border border-[var(--color-line)] p-3">
          <img src={ctx.verFoto(p.foto)} alt="" className="aspect-[4/3] w-full rounded-lg bg-[var(--color-sand)] object-cover" />
          <TrocarFoto ctx={ctx} maximo={1600} aoTrocar={(foto) => setPolaroid(lista, n, { foto })} />
          <Campo rotulo={`Legenda da foto ${n + 1}`}>
            <input className={classeCampo} value={p.legenda} onChange={(e) => setPolaroid(lista, n, { legenda: e.target.value })} maxLength={80} />
          </Campo>
          <Campo rotulo="Descrição da foto" dica="O que aparece na foto (para leitor de tela).">
            <input className={classeCampo} value={p.alt} onChange={(e) => setPolaroid(lista, n, { alt: e.target.value })} maxLength={200} />
          </Campo>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      <Aviso tipo="info">Troque as fotos à vontade: nada muda no site até você clicar em <strong>Salvar e publicar</strong>, lá embaixo.</Aviso>

      <Secao
        numero={1}
        titulo="Banner (foto do título)"
        acao={
          f.banner.length < MAX_BANNER && (
            <TrocarFoto ctx={ctx} maximo={2400} rotulo="Adicionar foto" aoTrocar={(foto) => setF((x) => ({ ...x, banner: [...x.banner, { foto, alt: '', posicao: 50 }] }))} />
          )
        }
      >
        <p className="-mt-2 mb-3 text-[13px] text-[var(--color-muted)]">
          As fotos passam sozinhas no topo da página inicial, na ordem abaixo. Use fotos deitadas (horizontais) e de boa qualidade. No celular aparece um recorte em pé do meio da foto.
        </p>
        <ul className="space-y-4">
          {f.banner.map((b, n) => (
            <li key={`${b.foto}-${n}`} className="grid gap-3 rounded-xl border border-[var(--color-line)] p-3 sm:grid-cols-[1.4fr_1fr]">
              <div className="relative">
                <img src={ctx.verFoto(b.foto)} alt="" className="aspect-video w-full rounded-lg bg-black object-cover" style={{ objectPosition: `center ${b.posicao}%` }} />
                <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">{n + 1}ª foto</span>
              </div>
              <div className="space-y-3">
                <TrocarFoto ctx={ctx} maximo={2400} aoTrocar={(foto) => setBanner(n, { foto })} />
                <Enquadramento valor={b.posicao} aoMudar={(posicao) => setBanner(n, { posicao })} />
                <Campo rotulo="Descrição da foto">
                  <input className={classeCampo} value={b.alt} onChange={(e) => setBanner(n, { alt: e.target.value })} maxLength={200} placeholder="Ex.: Faixa da Rasta no Bezerrão" />
                </Campo>
                <div className="flex flex-wrap gap-1">
                  <button type="button" disabled={n === 0} onClick={() => moverBanner(n, n - 1)} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--color-navy)] hover:bg-[var(--color-sand)] disabled:opacity-30">
                    <ArrowUp className="size-4" aria-hidden /> Antes
                  </button>
                  <button type="button" disabled={n === f.banner.length - 1} onClick={() => moverBanner(n, n + 1)} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--color-navy)] hover:bg-[var(--color-sand)] disabled:opacity-30">
                    <ArrowDown className="size-4" aria-hidden /> Depois
                  </button>
                  <button
                    type="button"
                    disabled={f.banner.length === 1}
                    onClick={() => setF((x) => ({ ...x, banner: x.banner.filter((_, i) => i !== n) }))}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#b42318] hover:bg-[#fdecec] disabled:opacity-30"
                  >
                    <Trash2 className="size-4" aria-hidden /> Tirar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Secao>

      <Secao numero={2} titulo="Fundo das páginas internas">
        <p className="-mt-2 mb-3 text-[13px] text-[var(--color-muted)]">Aparece escurecida atrás do título das páginas Produtos, Quem somos, Dúvidas e Fale conosco.</p>
        <div className="relative mb-3 overflow-hidden rounded-lg bg-[var(--color-black)]">
          <img src={ctx.verFoto(f.fundoPaginas)} alt="" className="h-32 w-full object-cover opacity-40" />
          <span className="heading absolute inset-0 grid place-items-center text-4xl text-white">Ver produtos</span>
        </div>
        <TrocarFoto ctx={ctx} maximo={1600} aoTrocar={(foto) => setF((x) => ({ ...x, fundoPaginas: foto }))} />
      </Secao>

      <Secao numero={3} titulo="Quem somos (página inicial)">
        <div className="grid gap-3 sm:grid-cols-2">
          <img src={ctx.verFoto(f.quemSomos.foto)} alt="" className="aspect-[3/2] w-full rounded-lg bg-[var(--color-sand)] object-cover" />
          <div className="space-y-3">
            <TrocarFoto ctx={ctx} maximo={1600} aoTrocar={(foto) => setF((x) => ({ ...x, quemSomos: { ...x.quemSomos, foto } }))} />
            <Campo rotulo="Descrição da foto">
              <input className={classeCampo} value={f.quemSomos.alt} onChange={(e) => setF((x) => ({ ...x, quemSomos: { ...x.quemSomos, alt: e.target.value } }))} maxLength={200} />
            </Campo>
          </div>
        </div>
      </Secao>

      <Secao numero={4} titulo="Como atuamos (4 quadros)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {f.pilares.map((p, n) => (
            <div key={n} className="space-y-2">
              <img src={ctx.verFoto(p.foto)} alt="" className="aspect-[3/4] w-full rounded-lg bg-black object-cover" style={{ objectPosition: `center ${p.posicao}%` }} />
              <TrocarFoto ctx={ctx} maximo={1200} rotulo="Trocar" aoTrocar={(foto) => setF((x) => ({ ...x, pilares: x.pilares.map((q, i) => (i === n ? { ...q, foto } : q)) }))} />
              <input
                className={classeCampo}
                aria-label={`Título do quadro ${n + 1}`}
                value={p.titulo}
                onChange={(e) => setF((x) => ({ ...x, pilares: x.pilares.map((q, i) => (i === n ? { ...q, titulo: e.target.value } : q)) }))}
                maxLength={30}
              />
              <Enquadramento valor={p.posicao} aoMudar={(posicao) => setF((x) => ({ ...x, pilares: x.pilares.map((q, i) => (i === n ? { ...q, posicao } : q)) }))} />
            </div>
          ))}
        </div>
      </Secao>

      <Secao numero={5} titulo="Ação social (4 fotos em volta do vídeo)">
        {polaroids('acaoSocial')}
      </Secao>

      <Secao numero={6} titulo="Caravanas (4 fotos em volta do vídeo)">
        {polaroids('caravanas')}
      </Secao>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-line)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl gap-3 px-3 py-3 sm:px-4">
          <button type="button" disabled={!mudou} onClick={() => setF(ctx.dados.fotos)} className="btn btn-ghost flex-1 justify-center py-3.5 text-base disabled:opacity-40 sm:flex-none sm:px-8">
            Desfazer
          </button>
          <button type="button" onClick={salvar} disabled={!mudou || ctx.salvando} className="btn btn-green flex-[2] justify-center py-3.5 text-base disabled:opacity-40 sm:ml-auto sm:flex-none sm:px-10">
            <ImagePlus className="size-5" aria-hidden /> {ctx.salvando ? 'Salvando…' : 'Salvar e publicar'}
          </button>
        </div>
      </div>
    </div>
  )
}
