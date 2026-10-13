# Conexão com o Segundo Cérebro

Este projeto é acompanhado no vault Obsidian "central":
`C:\Users\Administrador\OneDrive\Desktop\Nova pasta\central\Projetos de Sites\17,5 RASTA\00 - RASTA (página principal).md`

Ao trabalhar aqui:
- Sempre que a palavra "site" aparecer numa mensagem sobre criar, alterar, analisar, desenvolver, validar ou publicar, ative a equipe completa (Guardião, Da Vinci, Diretor de Conversão/Devil, Conselho). Protocolo em `Nova pasta\central\0-comados de skill\Automação.md`.
- Layout baseado no site da Saúde Fit Gym (`C:\Users\Administrador\OneDrive\Desktop\saude-fit-gym`), mesma stack.
- Não inventar fotos, logos, depoimentos, números ou descontos. Preços e contatos vêm de `17,5 RASTA/03 - Produtos e preços.md`.
- Registre decisões e progresso em `17,5 RASTA/13 - Site (estrutura e histórico).md`.

## Painel de edição (/admin)
- Mesmo modelo do painel da SQW: tela em `admin/index.html` + `src/admin/`, servidor em `api/` (funções da Vercel). Cada "Salvar e publicar" vira um commit na main pelo GitHub (variável `GITHUB_TOKEN`, token fine-grained só deste repositório) e a Vercel publica em ~1 min.
- Setores: Produtos (com estoque: disponível, sob encomenda, esgotado e quantidade), Fotos do site (banner, fundo das páginas internas, quem somos, como atuamos, ação social, caravanas), Campanhas (cupons e faixa amarela no topo) e Contatos.
- Dados editáveis: `src/data/produtos.json`, `fotos.json`, `campanhas.json`, `contatos.json`. Ao mudar campos, atualizar `api/_lib/validar.js` e o formulário juntos. Categorias: manter `CATEGORIES` (products.ts) igual a `api/_lib/validar.js`.
- Fotos de produtos ficam em `public/loja/`, as do site em `public/fotos/`; as enviadas pelo painel vão para `.../painel/<mês>/` e só essas são apagadas quando deixam de ser usadas.
- Banner: `scripts/preparar-fotos.mjs` (predev/prebuild) gera 900/1672/2400 px e o recorte de celular em `public/_otim/banner` e `src/data/fotos.gen.json` (fora do git). As fotos originais de `/public/hero` têm recortes feitos à mão e são reaproveitadas.
- Acessos: `node scripts/criar-acesso.mjs <usuario> "<Nome>"`; hashes na variável `ADMIN_USERS` da Vercel, sessão assinada com `SESSAO_SEGREDO`. Teste local sem publicar: `node scripts/painel-local.mjs` + `npm run dev` (variáveis em `.env.painel.local`, fora do git).

## Publicação
- Site: https://rasta-do-gama.vercel.app
- Repositório privado: https://github.com/claraca2020-cell/rasta-do-gama (branch main)
- Deploy automático: todo git push na main publica na Vercel.
- Nunca colocar chaves/tokens no código: usar variáveis de ambiente da Vercel (.env está no .gitignore).

