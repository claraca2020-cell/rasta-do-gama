import { useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, LayoutGrid, Rows3, Star, Trash2, X } from 'lucide-react'

type Props = {
  fotos: string[]
  verFoto: (caminho: string) => string
  aoMudar: (fotos: string[]) => void
}

// Grade de fotos do produto, como nas lojas virtuais: arrastar e soltar (mouse ou dedo), escolher a posição
// pelo número, virar capa, e selecionar várias fotos (ex.: todas da sala) para mover juntas.
// No celular é preciso segurar a foto um instante antes de arrastar, para a tela continuar rolando.
export function FotosOrdenaveis({ fotos, verFoto, aoMudar }: Props) {
  const [arrastando, setArrastando] = useState<string | null>(null)
  const [selecionadas, setSelecionadas] = useState<string[]>([])
  const [compacto, setCompacto] = useState(false)
  const sensores = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  // Mantém a seleção só com fotos que ainda existem (ex.: depois de tirar uma).
  const marcadas = selecionadas.filter((f) => fotos.includes(f))
  const restantes = fotos.filter((f) => !marcadas.includes(f))

  const mover = (de: number, para: number) => {
    if (de === para || para < 0 || para >= fotos.length) return
    aoMudar(arrayMove(fotos, de, para))
  }

  const alternar = (f: string) => setSelecionadas((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]))

  /** Coloca as fotos marcadas (na ordem em que aparecem) a partir da posição escolhida. */
  const moverMarcadas = (posicao: number) => {
    const grupo = fotos.filter((f) => marcadas.includes(f))
    const lista = [...restantes]
    lista.splice(posicao, 0, ...grupo)
    aoMudar(lista)
    setSelecionadas([])
  }

  const tirarMarcadas = () => {
    if (!window.confirm(`Tirar ${marcadas.length} foto(s) deste produto?`)) return
    aoMudar(restantes)
    setSelecionadas([])
  }

  const inicio = (e: DragStartEvent) => setArrastando(String(e.active.id))
  const fim = (e: DragEndEvent) => {
    setArrastando(null)
    if (!e.over || e.active.id === e.over.id) return
    mover(fotos.indexOf(String(e.active.id)), fotos.indexOf(String(e.over.id)))
  }

  if (!fotos.length) return null

  return (
    <div className="mt-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] text-[var(--color-muted)]">
          {fotos.length} fotos · toque no círculo de cada foto para selecionar várias e mover juntas
        </p>
        <button
          type="button"
          onClick={() => setCompacto((c) => !c)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-line)] bg-white px-3 py-1.5 text-sm font-semibold text-[var(--color-navy)] hover:bg-[var(--color-sand)]"
        >
          {compacto ? <Rows3 className="size-4" aria-hidden /> : <LayoutGrid className="size-4" aria-hidden />}
          {compacto ? 'Fotos maiores' : 'Ver todas menores'}
        </button>
      </div>

      {marcadas.length > 0 && (
        <div className="fixed inset-x-3 bottom-[5.5rem] z-40 mx-auto flex max-w-4xl flex-wrap items-center gap-1.5 rounded-xl bg-[var(--color-navy)] p-2 sm:gap-2 sm:p-2.5 text-white shadow-2xl">
          <span className="px-1 text-sm font-semibold">
            {marcadas.length} selecionada{marcadas.length > 1 ? 's' : ''}
          </span>
          <label className="flex items-center gap-1.5 text-sm">
            <span className="hidden sm:inline">Colocar na posição</span>
            <select
              value=""
              onChange={(e) => e.target.value !== '' && moverMarcadas(Number(e.target.value))}
              className="h-9 rounded-lg bg-white px-2 text-sm font-semibold text-[var(--color-navy)]"
              aria-label="Escolher a posição das fotos selecionadas"
            >
              <option value="">posição…</option>
              {Array.from({ length: restantes.length + 1 }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? '1 (capa em diante)' : i === restantes.length ? `${i + 1} (no final)` : `${i + 1}º`}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => moverMarcadas(0)} className="rounded-lg bg-[var(--color-green)] px-3 py-1.5 text-sm font-bold text-[var(--color-navy-deep)]">
            Levar para o início
          </button>
          <button type="button" onClick={tirarMarcadas} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-[#ffb4ab] hover:bg-white/10">
            <Trash2 className="size-4" aria-hidden /> Tirar
          </button>
          <button type="button" onClick={() => setSelecionadas([])} className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm hover:bg-white/10">
            <X className="size-4" aria-hidden /> <span className="hidden sm:inline">Limpar seleção</span><span className="sm:hidden">Limpar</span>
          </button>
        </div>
      )}

      <DndContext sensors={sensores} collisionDetection={closestCenter} onDragStart={inicio} onDragEnd={fim} onDragCancel={() => setArrastando(null)}>
        <SortableContext items={fotos} strategy={rectSortingStrategy}>
          <ul className={compacto ? 'grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6' : 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'}>
            {fotos.map((f, n) => (
              <Cartao
                key={f}
                foto={f}
                n={n}
                total={fotos.length}
                compacto={compacto}
                marcada={marcadas.includes(f)}
                verFoto={verFoto}
                aoMarcar={() => alternar(f)}
                aoMover={(para) => mover(n, para)}
                aoTirar={() => aoMudar(fotos.filter((x) => x !== f))}
              />
            ))}
          </ul>
        </SortableContext>
        <DragOverlay>
          {arrastando && (
            <img
              src={verFoto(arrastando)}
              alt=""
              className="aspect-square w-full rotate-2 rounded-xl bg-white object-contain shadow-2xl ring-4 ring-[var(--color-green)]"
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

function Cartao({
  foto,
  n,
  total,
  compacto,
  marcada,
  verFoto,
  aoMarcar,
  aoMover,
  aoTirar,
}: {
  foto: string
  n: number
  total: number
  compacto: boolean
  marcada: boolean
  verFoto: (c: string) => string
  aoMarcar: () => void
  aoMover: (para: number) => void
  aoTirar: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: foto })
  const estilo = { transform: CSS.Transform.toString(transform), transition }
  const borda = isDragging
    ? 'border-dashed border-[var(--color-green)] opacity-40'
    : marcada
      ? 'border-[var(--color-green)] ring-2 ring-[var(--color-green)]'
      : 'border-[var(--color-line)]'

  return (
    <li ref={setNodeRef} style={estilo} className={`overflow-hidden rounded-xl border bg-[var(--color-sand)] ${borda}`}>
      <div
        {...attributes}
        {...listeners}
        aria-label={`Foto ${n + 1}. Arraste para mudar de posição`}
        className="relative cursor-grab touch-manipulation select-none active:cursor-grabbing"
      >
        <img src={verFoto(foto)} alt={`Foto ${n + 1}`} loading="lazy" draggable={false} className="pointer-events-none aspect-square w-full bg-white object-contain" />
        {n === 0 ? (
          <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-md bg-[var(--color-green)] px-1.5 py-0.5 text-xs font-bold text-[var(--color-navy-deep)]">
            <Star className="size-3" aria-hidden /> {compacto ? '1' : 'Capa'}
          </span>
        ) : (
          <span className="absolute top-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-xs font-semibold text-white">{n + 1}</span>
        )}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onClick={aoMarcar}
          aria-pressed={marcada}
          aria-label={marcada ? `Desmarcar a foto ${n + 1}` : `Selecionar a foto ${n + 1}`}
          className={`absolute top-1 right-1 grid size-8 place-items-center rounded-full border-2 ${marcada ? 'border-[var(--color-green)] bg-[var(--color-green)] text-[var(--color-navy-deep)]' : 'border-white bg-black/30 text-transparent hover:bg-black/45'}`}
        >
          <Check className="size-4" strokeWidth={3} />
        </button>
      </div>
      {!compacto && (
        <div className="flex min-h-12 items-center justify-between gap-0.5 bg-white p-1.5">
          <label className="shrink-0">
            <span className="sr-only">Posição</span>
            <select
              value={n}
              onChange={(e) => aoMover(Number(e.target.value))}
              className="h-9 w-[4.75rem] rounded-lg border border-[var(--color-line)] bg-white px-1.5 text-sm font-semibold text-[var(--color-navy)]"
              aria-label={`Posição da foto ${n + 1}`}
            >
              {Array.from({ length: total }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? '1 ★' : `${i + 1}º`}
                </option>
              ))}
            </select>
          </label>
          {n > 0 ? (
            <button
              type="button"
              onClick={() => aoMover(0)}
              title="Virar capa"
              aria-label={`Virar capa: usar a foto ${n + 1} como capa`}
              className="flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg px-1.5 text-xs font-semibold whitespace-nowrap text-[var(--color-navy)] hover:bg-[var(--color-sand)]"
            >
              <Star className="size-4" aria-hidden />
              <span className="hidden lg:inline">Capa</span>
            </button>
          ) : (
            <span className="flex h-9 min-w-9 items-center justify-center text-[var(--color-green)]" title="Esta é a capa">
              <Star className="size-4 fill-current" aria-label="Esta é a capa" />
            </span>
          )}
          <button type="button" onClick={aoTirar} className="grid size-9 shrink-0 place-items-center rounded-lg text-[#b42318] hover:bg-[#fdecec]" aria-label={`Tirar a foto ${n + 1}`}>
            <Trash2 className="size-4" />
          </button>
        </div>
      )}
    </li>
  )
}
