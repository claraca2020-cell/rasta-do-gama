// Prepara as fotos do banner antes do build (roda sozinho em `npm run dev` e `npm run build`).
// Para cada foto escolhida no painel (src/data/fotos.json → banner), gera em public/_otim/banner:
//   900, 1672 e 2400 px de largura (computador e tablet) e um recorte vertical 3:5 para o celular.
// As 3 fotos originais (/hero/<nome>-2400.webp) já têm versões e recortes feitos à mão: são reaproveitadas.
// Resultado: src/data/fotos.gen.json, com { foto: { src, srcSet, mobile } }.
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const pub = join(raiz, 'public')
const { banner } = JSON.parse(readFileSync(join(raiz, 'src/data/fotos.json'), 'utf8'))
const LARGURAS = [900, 1672, 2400]

const novo = (saida, entrada) => !existsSync(saida) || statSync(saida).mtimeMs < statSync(entrada).mtimeMs
const srcSet = (base) => LARGURAS.map((w) => `${base}-${w}.webp ${w}w`).join(', ')

const meta = {}
let geradas = 0
for (const { foto, posicao = 50 } of banner) {
  const pronta = foto.match(/^\/hero\/(.+)-2400\.webp$/)
  if (pronta) {
    const base = `/hero/${pronta[1]}`
    if ([...LARGURAS.map((w) => `${base}-${w}.webp`), `${base}-mobile.webp`].every((f) => existsSync(join(pub, f)))) {
      meta[foto] = { src: `${base}-1672.webp`, srcSet: srcSet(base), mobile: `${base}-mobile.webp` }
      continue
    }
  }
  const arquivo = join(pub, foto)
  if (!existsSync(arquivo)) {
    console.warn('⚠ Foto do banner não encontrada (fica fora do site):', foto)
    continue
  }
  const base = '/_otim/banner/' + foto.replace(/^\//, '').replace(/\.[^./]+$/, '').replace(/[/]/g, '-')
  mkdirSync(join(pub, '_otim/banner'), { recursive: true })
  for (const w of LARGURAS) {
    const saida = join(pub, `${base}-${w}.webp`)
    if (novo(saida, arquivo)) {
      await sharp(arquivo).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(saida)
      geradas++
    }
  }
  // Celular: recorte 3:5 centrado na horizontal e na altura escolhida no painel ("posição" 0 = topo, 100 = base).
  const mobile = join(pub, `${base}-mobile.webp`)
  if (novo(mobile, arquivo)) {
    const { width, height } = await sharp(arquivo).rotate().metadata()
    const h = height
    const w = Math.min(width, Math.round((h * 3) / 5))
    const left = Math.round((width - w) / 2)
    const corte = { left, top: 0, width: w, height: h }
    await sharp(arquivo).rotate().extract(corte).resize({ width: 900, height: 1500, fit: 'cover', position: posicao <= 33 ? 'top' : posicao >= 67 ? 'bottom' : 'centre' }).webp({ quality: 76 }).toFile(mobile)
    geradas++
  }
  meta[foto] = { src: `${base}-1672.webp`, srcSet: srcSet(base), mobile: `${base}-mobile.webp` }
}

writeFileSync(join(raiz, 'src/data/fotos.gen.json'), JSON.stringify(meta))
console.log(`${Object.keys(meta).length} fotos de banner prontas (${geradas} arquivos gerados agora)`)
