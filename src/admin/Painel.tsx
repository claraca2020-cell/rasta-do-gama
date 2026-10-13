import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { ExternalLink, Image as ImageIcon, LogOut, Phone, ShoppingBag, Ticket } from 'lucide-react'
import { api, ErroApi, type Dados, type Quem } from './api'
import { CampanhasAba } from './CampanhasAba'
import { ContatosAba } from './ContatosAba'
import { reduzirFoto } from './fotos'
import { FotosSiteAba } from './FotosSiteAba'
import { ProdutosAba } from './ProdutosAba'
import { Aviso, Carregando, Campo, classeCampo } from './ui'

export type FotoPendente = { blob: string; preview: string }

/** O que cada aba recebe para salvar: dados atuais + função que publica e avisa o resultado. */
export interface Contexto {
  dados: Dados
  publicar: (parcial: Partial<Omit<Dados, 'versao'>>, resumo: string) => Promise<boolean>
  /** pasta "loja" = foto de produto; "fotos" = foto do site. maximo = maior lado em px. */
  enviarFoto: (arquivo: File, pasta: 'loja' | 'fotos', maximo?: number) => Promise<string>
  /** Foto recém-enviada ainda não está no site: mostra a cópia local. */
  verFoto: (caminho: string | null | undefined) => string
  salvando: boolean
}

// Setores separados para não ficar confuso.
const ABAS = [
  { id: 'produtos', nome: 'Produtos', Icone: ShoppingBag },
  { id: 'fotos', nome: 'Fotos do site', Icone: ImageIcon },
  { id: 'campanhas', nome: 'Campanhas', Icone: Ticket },
  { id: 'contatos', nome: 'Contatos', Icone: Phone },
] as const
type Aba = (typeof ABAS)[number]['id']

export function Painel() {
  const [quem, setQuem] = useState<Quem | null>(null)
  const [dados, setDados] = useState<Dados | null>(null)
  const [estado, setEstado] = useState<'carregando' | 'login' | 'pronto' | 'falha'>('carregando')
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null)
  const [aba, setAba] = useState<Aba>('produtos')
  const [salvando, setSalvando] = useState(false)
  const pendentes = useRef(new Map<string, FotoPendente>())

  const carregar = useCallback(async () => {
    setEstado('carregando')
    try {
      const { quem, ...d } = await api.dados()
      setQuem(quem)
      setDados(d)
      setEstado('pronto')
    } catch (e) {
      if (e instanceof ErroApi && e.status === 401) setEstado('login')
      else {
        setAviso({ tipo: 'erro', texto: (e as Error).message })
        setEstado('falha')
      }
    }
  }, [])

  useEffect(() => {
    void carregar()
  }, [carregar])

  // O aviso de "Salvo!" some sozinho; os de erro ficam até a pessoa fechar.
  useEffect(() => {
    if (aviso?.tipo !== 'ok') return
    const t = setTimeout(() => setAviso(null), 8000)
    return () => clearTimeout(t)
  }, [aviso])

  const publicar: Contexto['publicar'] = async (parcial, resumo) => {
    if (!dados) return false
    setSalvando(true)
    setAviso(null)
    try {
      const fotos = [...pendentes.current].map(([caminho, p]) => ({ caminho, blob: p.blob }))
      const r = await api.publicar(dados.versao, parcial, fotos, resumo)
      setDados({ ...dados, ...r })
      setAviso({ tipo: 'ok', texto: 'Salvo! O site mostra a mudança em cerca de 1 a 2 minutos.' })
      return true
    } catch (e) {
      if (e instanceof ErroApi && e.status === 401) setEstado('login')
      setAviso({ tipo: 'erro', texto: (e as Error).message })
      return false
    } finally {
      setSalvando(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const enviarFoto: Contexto['enviarFoto'] = async (arquivo, pasta, maximo = 1600) => {
    const f = await reduzirFoto(arquivo, maximo)
    const { caminho, blob } = await api.foto(f.base64, f.tipo, pasta)
    pendentes.current.set(caminho, { blob, preview: f.preview })
    return caminho
  }

  const verFoto = (caminho: string | null | undefined) => (caminho ? (pendentes.current.get(caminho)?.preview ?? caminho) : '/favicon.png')

  const sair = async () => {
    await api.sair().catch(() => {})
    setQuem(null)
    setDados(null)
    setEstado('login')
  }

  if (estado === 'login') return <Entrar aoEntrar={carregar} />

  const ctx = dados ? { dados, publicar, enviarFoto, verFoto, salvando } : null

  return (
    <div className="min-h-dvh bg-[var(--color-cream)] pb-28">
      <header className="sticky top-0 z-30 bg-[var(--color-navy)] text-white shadow-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.png" alt="" className="size-8 rounded-lg" />
            <span className="heading text-2xl leading-none tracking-wide">Rasta do Gama</span>
            <span className="hidden rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold tracking-wide sm:inline">PAINEL</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <a href="/" target="_blank" rel="noopener" className="flex items-center gap-1.5 rounded-lg px-3 py-2 hover:bg-white/10">
              <ExternalLink className="size-4" aria-hidden /> <span className="hidden sm:inline">Ver site</span>
            </a>
            <button type="button" onClick={sair} className="flex items-center gap-1.5 rounded-lg px-3 py-2 hover:bg-white/10">
              <LogOut className="size-4" aria-hidden /> Sair
            </button>
          </div>
        </div>
        {estado === 'pronto' && (
          <nav className="mx-auto flex max-w-4xl gap-1 px-2 sm:px-4" aria-label="Setores do painel">
            {ABAS.map(({ id, nome, Icone }) => (
              <button
                key={id}
                type="button"
                onClick={() => setAba(id)}
                aria-current={aba === id ? 'page' : undefined}
                className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-t-xl px-1 py-2 text-[13px] font-semibold transition-colors sm:flex-none sm:flex-row sm:gap-2 sm:px-6 sm:py-3 sm:text-[15px] ${
                  aba === id ? 'bg-[var(--color-cream)] text-[var(--color-navy)]' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Icone className="size-[18px]" aria-hidden /> {nome}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-4xl space-y-4 px-3 pt-5 sm:px-4">
        {quem && estado === 'pronto' && (
          <p className="px-1 text-[15px] text-[var(--color-muted)]">
            Olá, <strong className="text-[var(--color-navy)]">{quem.nome}</strong>! Aqui você muda o que aparece no site.
          </p>
        )}
        {aviso && (
          <Aviso tipo={aviso.tipo} aoFechar={() => setAviso(null)}>
            {aviso.texto}
            {aviso.texto.includes('Recarregar') && (
              <button type="button" onClick={carregar} className="btn btn-navy mt-3 block">
                Recarregar
              </button>
            )}
          </Aviso>
        )}
        {estado === 'carregando' && <Carregando />}
        {estado === 'falha' && (
          <button type="button" onClick={carregar} className="btn btn-navy">
            Tentar de novo
          </button>
        )}
        {estado === 'pronto' && ctx && (
          <>
            {aba === 'produtos' && <ProdutosAba ctx={ctx} />}
            {aba === 'fotos' && <FotosSiteAba ctx={ctx} />}
            {aba === 'campanhas' && <CampanhasAba ctx={ctx} />}
            {aba === 'contatos' && <ContatosAba ctx={ctx} />}
          </>
        )}
      </main>
    </div>
  )
}

function Entrar({ aoEntrar }: { aoEntrar: () => void }) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await api.entrar(usuario, senha)
      aoEntrar()
    } catch (err) {
      setErro((err as Error).message)
      setEnviando(false)
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-[var(--color-navy)] px-4 py-10">
      <form onSubmit={enviar} className="w-full max-w-sm space-y-5 rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="text-center">
          <img src="/favicon.png" alt="" className="mx-auto mb-3 size-14 rounded-2xl" />
          <h1 className="heading text-4xl text-[var(--color-navy)]">Painel Rasta do Gama</h1>
          <p className="mt-1 text-[15px] text-[var(--color-muted)]">Entre para cuidar da loja e das fotos do site.</p>
        </div>
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        <Campo rotulo="Usuário">
          <input className={classeCampo} value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" autoCapitalize="none" autoCorrect="off" required />
        </Campo>
        <Campo rotulo="Senha">
          <input className={classeCampo} type="password" value={senha} onChange={(e) => setSenha(e.target.value.trim())} autoComplete="current-password" required />
        </Campo>
        <button type="submit" disabled={enviando} className="btn btn-green w-full justify-center py-3.5 text-base disabled:opacity-60">
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
