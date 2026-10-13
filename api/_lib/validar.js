// Confere o que vem do painel antes de gravar: só os campos conhecidos, nos formatos que o site espera.
// Erros voltam em português para aparecer na tela.

// Manter igual a CATEGORIES em src/data/products.ts.
const CATEGORIAS = new Set(['Bonés', 'Casacos', 'Camisas', 'Acessórios'])
const ESTOQUE = new Set(['disponivel', 'encomenda', 'esgotado'])
const FOTO_LOJA = /^\/loja\/[a-z0-9._-]+(\/[a-z0-9._-]+){0,3}\.(webp|jpe?g|png)$/
const FOTO_SITE = /^\/(hero|fotos)\/[a-z0-9._-]+(\/[a-z0-9._-]+){0,3}\.(webp|jpe?g|png)$/

class Invalido extends Error {}
export { Invalido }

const falha = (msg) => {
  throw new Invalido(msg)
}

function texto(v, campo, { min = 0, max = 200, multilinha = false } = {}) {
  const t = String(v ?? '').replace(/\r\n/g, '\n').trim()
  if (t.length < min) falha(min === 1 ? `Preencha o campo "${campo}".` : `"${campo}" está muito curto.`)
  if (t.length > max) falha(`"${campo}" passou do limite de ${max} caracteres.`)
  return multilinha ? t : t.replace(/\s+/g, ' ')
}

function lista(v, campo, max) {
  if (v === undefined || v === null) return []
  if (!Array.isArray(v)) falha(`"${campo}" está num formato inválido.`)
  if (v.length > max) falha(`No máximo ${max} itens em "${campo}".`)
  return v
}

const posicao = (v) => {
  const n = Math.round(Number(v))
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50
}

function fotoSite(v, campo) {
  const f = String(v ?? '')
  if (!FOTO_SITE.test(f)) falha(`${campo}: escolha uma foto.`)
  return f
}

// ---------- Produtos ----------
export function validarProduto(p, n) {
  const onde = (msg) => `Produto ${n}: ${msg}`
  try {
    const slug = texto(p?.slug, 'Endereço', { min: 3, max: 80 }).toLowerCase()
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) falha('o endereço só pode ter letras minúsculas, números e hífen.')
    const category = String(p.category ?? '')
    if (!CATEGORIAS.has(category)) falha('escolha a categoria.')
    const price = texto(p.price, 'Preço', { max: 12 })
    if (price && !/^\d{1,3}(\.\d{3})*,\d{2}$|^\d+,\d{2}$/.test(price)) falha('o preço precisa estar no formato 64,90.')
    const stock = ESTOQUE.has(p.stock) ? p.stock : falha('escolha a situação do estoque.')
    let quantity = null
    if (p.quantity !== null && p.quantity !== undefined && p.quantity !== '') {
      quantity = Number(p.quantity)
      if (!Number.isInteger(quantity) || quantity < 0 || quantity > 99999) falha('a quantidade em estoque precisa ser um número inteiro.')
    }
    const images = lista(p.images, 'Fotos', 12).map(String)
    if (images.some((f) => !FOTO_LOJA.test(f))) falha('há uma foto com endereço inválido.')
    const options = lista(p.options, 'Opções', 4).map((o) => {
      const label = texto(o?.label, 'Nome da opção', { min: 1, max: 30 })
      const values = [...new Set(lista(o?.values, label, 30).map((v) => texto(v, label, { min: 1, max: 20 })))]
      if (!values.length) falha(`a opção "${label}" está sem valores.`)
      return { label, values }
    })
    return {
      slug,
      name: texto(p.name, 'Nome', { min: 1, max: 100 }),
      category,
      price,
      unit: texto(p.unit, 'Unidade', { max: 40 }) || 'por unidade',
      badge: texto(p.badge, 'Selo', { max: 24 }),
      description: texto(p.description, 'Descrição', { max: 2000, multilinha: true }),
      features: lista(p.features, 'Destaques', 12)
        .map((f) => texto(f, 'Destaque', { max: 80 }))
        .filter(Boolean),
      options,
      images: [...new Set(images)],
      stock,
      quantity,
      visible: p.visible !== false,
    }
  } catch (e) {
    if (e instanceof Invalido) throw new Invalido(onde(e.message))
    throw e
  }
}

export function validarProdutos(v) {
  const saida = lista(v, 'Produtos', 300).map((p, n) => validarProduto(p, n + 1))
  const repetido = saida.find((p, n) => saida.findIndex((q) => q.slug === p.slug) !== n)
  if (repetido) falha(`O endereço "${repetido.slug}" aparece em mais de um produto.`)
  return saida
}

// ---------- Fotos do site ----------
export function validarFotos(f) {
  if (!f || typeof f !== 'object') falha('Fotos do site em formato inválido.')
  const banner = lista(f.banner, 'Banner', 6).map((b, n) => ({
    foto: fotoSite(b?.foto, `Banner, foto ${n + 1}`),
    alt: texto(b?.alt, `Descrição da foto ${n + 1} do banner`, { min: 1, max: 200 }),
    posicao: posicao(b?.posicao),
  }))
  if (!banner.length) falha('O banner precisa de pelo menos 1 foto.')
  const quatro = (v, campo, montar) => {
    const l = lista(v, campo, 4)
    if (l.length !== 4) falha(`"${campo}" precisa ter 4 fotos.`)
    return l.map(montar)
  }
  const polaroid = (campo) => (x, n) => ({
    foto: fotoSite(x?.foto, `${campo}, foto ${n + 1}`),
    alt: texto(x?.alt, `Descrição da foto ${n + 1} (${campo})`, { min: 1, max: 200 }),
    legenda: texto(x?.legenda, `Legenda da foto ${n + 1} (${campo})`, { min: 1, max: 80 }),
  })
  return {
    banner,
    fundoPaginas: fotoSite(f.fundoPaginas, 'Fundo das páginas'),
    quemSomos: { foto: fotoSite(f.quemSomos?.foto, 'Quem somos'), alt: texto(f.quemSomos?.alt, 'Descrição da foto do Quem somos', { min: 1, max: 200 }) },
    pilares: quatro(f.pilares, 'Como atuamos', (p, n) => ({
      titulo: texto(p?.titulo, `Título do quadro ${n + 1}`, { min: 1, max: 30 }),
      foto: fotoSite(p?.foto, `Como atuamos, quadro ${n + 1}`),
      posicao: posicao(p?.posicao),
    })),
    acaoSocial: quatro(f.acaoSocial, 'Ação social', polaroid('Ação social')),
    caravanas: quatro(f.caravanas, 'Caravanas', polaroid('Caravanas')),
  }
}

// ---------- Campanhas ----------
export function validarCampanhas(v) {
  const saida = lista(v, 'Campanhas', 30).map((c, n) => {
    const onde = (msg) => `Campanha ${n + 1}: ${msg}`
    try {
      const id = texto(c?.id, 'Código', { min: 3, max: 40 }).toLowerCase()
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) falha('código inválido.')
      const cupom = texto(c?.cupom, 'Cupom', { max: 20 }).toUpperCase().replace(/\s+/g, '')
      if (cupom && !/^[A-Z0-9]{3,20}$/.test(cupom)) falha('o cupom só pode ter letras e números, sem espaço.')
      return {
        id,
        titulo: texto(c?.titulo, 'Título', { min: 1, max: 60 }),
        texto: texto(c?.texto, 'Texto', { max: 160 }),
        cupom,
        ativa: c?.ativa === true,
        faixa: c?.faixa === true,
      }
    } catch (e) {
      if (e instanceof Invalido) throw new Invalido(onde(e.message))
      throw e
    }
  })
  const repetido = saida.find((c, n) => saida.findIndex((d) => d.id === c.id) !== n)
  if (repetido) falha(`O código "${repetido.id}" aparece em mais de uma campanha.`)
  if (saida.filter((c) => c.ativa && c.faixa).length > 1) falha('Só uma campanha ativa pode aparecer na faixa do site.')
  return saida
}

// ---------- Contatos ----------
export function validarContatos(c) {
  const whatsapp = texto(c?.whatsapp, 'WhatsApp', { min: 1, max: 30 })
  const d = whatsapp.replace(/\D/g, '')
  if (d.length < 10 || d.length > 13) falha('"WhatsApp" precisa ter DDD e número.')
  const instagram = texto(c?.instagram, 'Instagram', { min: 1, max: 200 })
  if (!/^https:\/\/(www\.)?instagram\.com\/[\w.]+\/?$/.test(instagram)) falha('O Instagram precisa ser um link como https://www.instagram.com/rastadogamaoficial/')
  return { whatsapp, instagram }
}
