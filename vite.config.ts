import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

const lerJson = (arquivo: string) => JSON.parse(readFileSync(fileURLToPath(new URL(arquivo, import.meta.url)), 'utf8'))

// A 1ª foto do banner (escolhida no painel) começa a baixar antes de tudo: é o maior elemento da tela.
function preloadBanner(): Plugin {
  return {
    name: 'preload-banner',
    transformIndexHtml(html) {
      if (!html.includes('<!--preload-banner-->')) return html
      const primeira = lerJson('./src/data/fotos.json').banner[0]?.foto
      const f = primeira && lerJson('./src/data/fotos.gen.json')[primeira]
      const tags = f
        ? `<link rel="preload" as="image" href="${f.mobile}" media="(max-width: 767px)" fetchpriority="high" />
    <link rel="preload" as="image" href="${f.src}" imagesrcset="${f.srcSet}" imagesizes="100vw" media="(min-width: 768px)" fetchpriority="high" />`
        : ''
      return html.replace('<!--preload-banner-->', tags)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), preloadBanner()],
  build: {
    rollupOptions: {
      // Duas páginas: o site (index.html) e o painel (admin/index.html), com códigos separados.
      input: {
        site: fileURLToPath(new URL('index.html', import.meta.url)),
        admin: fileURLToPath(new URL('admin/index.html', import.meta.url)),
      },
    },
  },
  // Em desenvolvimento, /api vai para scripts/painel-local.mjs.
  server: { proxy: { '/api': 'http://localhost:3001' } },
  preview: { proxy: { '/api': 'http://localhost:3001' } },
})
