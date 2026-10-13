import type { ReactNode } from 'react'

// Peças visuais do painel: letras e botões grandes, pensados para usar no celular.

export function Campo({ rotulo, dica, children, largo }: { rotulo: string; dica?: string; children: ReactNode; largo?: boolean }) {
  return (
    <label className={`block ${largo ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 block text-[15px] font-semibold text-[var(--color-navy)]">{rotulo}</span>
      {children}
      {dica && <span className="mt-1 block text-[13px] leading-snug text-[var(--color-muted)]">{dica}</span>}
    </label>
  )
}

export const classeCampo = 'field w-full rounded-xl px-3.5 py-3 text-base'

export function Secao({ numero, titulo, children, acao }: { numero?: number; titulo: string; children: ReactNode; acao?: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgb(0_0_0/0.06)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-lg font-bold text-[var(--color-navy)]">
          {numero !== undefined && (
            <span className="grid size-7 place-items-center rounded-lg bg-[var(--color-green)] text-sm text-[var(--color-navy-deep)]">{numero}</span>
          )}
          {titulo}
        </h2>
        {acao}
      </div>
      {children}
    </section>
  )
}

export function Aviso({ tipo, children, aoFechar }: { tipo: 'ok' | 'erro' | 'info'; children: ReactNode; aoFechar?: () => void }) {
  const cores = {
    ok: 'border-[var(--color-green)] bg-[#e6faf1] text-[#05502f]',
    erro: 'border-[#d64545] bg-[#fdecec] text-[#7a1717]',
    info: 'border-[var(--color-line)] bg-white text-[var(--color-ink)]',
  }
  return (
    <div role={tipo === 'erro' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border-l-4 px-4 py-3 text-[15px] ${cores[tipo]}`}>
      <div className="flex-1">{children}</div>
      {aoFechar && (
        <button type="button" onClick={aoFechar} className="-m-1 p-1 text-lg leading-none opacity-60 hover:opacity-100" aria-label="Fechar aviso">
          ×
        </button>
      )}
    </div>
  )
}

export function Carregando({ texto = 'Carregando…' }: { texto?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-[var(--color-muted)]" role="status">
      <span className="size-5 animate-spin rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-navy)]" />
      {texto}
    </div>
  )
}
