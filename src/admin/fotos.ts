// Reduz a foto no próprio aparelho antes de enviar: fica leve (poucos centenas de KB), na posição certa
// (celular deitado/em pé) e sem os dados de localização que o celular grava na foto.
export interface FotoReduzida {
  base64: string
  tipo: 'webp' | 'jpeg'
  preview: string
}

const paraBlob = (canvas: HTMLCanvasElement, tipo: string, qualidade: number) =>
  new Promise<Blob | null>((ok) => canvas.toBlob(ok, tipo, qualidade))

export async function reduzirFoto(arquivo: File, maximo = 1600): Promise<FotoReduzida> {
  let imagem: ImageBitmap
  try {
    imagem = await createImageBitmap(arquivo, { imageOrientation: 'from-image' })
  } catch {
    throw new Error(`Não consegui abrir "${arquivo.name}". Envie uma foto JPG, PNG ou WebP.`)
  }
  const escala = Math.min(1, maximo / Math.max(imagem.width, imagem.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(imagem.width * escala)
  canvas.height = Math.round(imagem.height * escala)
  canvas.getContext('2d')!.drawImage(imagem, 0, 0, canvas.width, canvas.height)
  imagem.close()
  // WebP quando o navegador sabe gerar; senão (Safari antigo) JPEG.
  let blob = await paraBlob(canvas, 'image/webp', 0.82)
  let tipo: FotoReduzida['tipo'] = 'webp'
  if (!blob || blob.type !== 'image/webp') {
    blob = await paraBlob(canvas, 'image/jpeg', 0.85)
    tipo = 'jpeg'
  }
  if (!blob) throw new Error(`Não consegui preparar "${arquivo.name}".`)
  const bytes = new Uint8Array(await blob.arrayBuffer())
  let binario = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binario += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return { base64: btoa(binario), tipo, preview: URL.createObjectURL(blob) }
}

/** Endereço do produto no site, a partir do nome (ex.: "Boné Five Panel" → "bone-five-panel"). */
export function slugDoNome(nome: string, existentes: string[]) {
  const base =
    nome
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'produto'
  let slug = base
  for (let n = 2; existentes.includes(slug); n++) slug = `${base}-${n}`
  return slug
}
