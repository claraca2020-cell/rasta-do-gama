import { useEffect, useState } from 'react'
import type { Contatos } from './api'
import type { Contexto } from './Painel'
import { Campo, classeCampo, Secao } from './ui'

export function ContatosAba({ ctx }: { ctx: Contexto }) {
  const [c, setC] = useState<Contatos>(ctx.dados.contatos)
  useEffect(() => setC(ctx.dados.contatos), [ctx.dados.contatos])
  const mudou = JSON.stringify(c) !== JSON.stringify(ctx.dados.contatos)

  return (
    <Secao titulo="Contatos que aparecem no site">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="WhatsApp" dica="Número que recebe os pedidos da sacola e todos os botões verdes do site. Ex.: (61) 98144-2152">
          <input className={classeCampo} type="tel" value={c.whatsapp} onChange={(e) => setC({ ...c, whatsapp: e.target.value })} />
        </Campo>
        <Campo rotulo="Link do Instagram" dica="Ex.: https://www.instagram.com/rastadogamaoficial/">
          <input className={classeCampo} type="url" value={c.instagram} onChange={(e) => setC({ ...c, instagram: e.target.value })} />
        </Campo>
      </div>
      <div className="mt-6 flex gap-3">
        <button type="button" disabled={!mudou} onClick={() => setC(ctx.dados.contatos)} className="btn btn-ghost flex-1 justify-center py-3 disabled:opacity-40 sm:flex-none sm:px-8">
          Desfazer
        </button>
        <button type="button" disabled={!mudou || ctx.salvando} onClick={() => ctx.publicar({ contatos: c }, 'atualiza contatos')} className="btn btn-green flex-[2] justify-center py-3 disabled:opacity-40 sm:ml-auto sm:flex-none sm:px-10">
          {ctx.salvando ? 'Salvando…' : 'Salvar e publicar'}
        </button>
      </div>
    </Secao>
  )
}
