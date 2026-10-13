// Cria um acesso ao painel da Rasta (/admin). Uso: node scripts/criar-acesso.mjs <usuario> "<Nome>"
// Mostra a senha (uma vez) e a linha para colocar na variável ADMIN_USERS da Vercel.
import { randomBytes, randomInt, scryptSync } from 'node:crypto'

const [usuario, nome] = process.argv.slice(2)
if (!usuario || !/^[a-z0-9._-]{3,30}$/.test(usuario)) {
  console.error('Uso: node scripts/criar-acesso.mjs <usuario> "<Nome>"  (usuário em minúsculas, sem espaço)')
  process.exit(1)
}
// Senha fácil de ditar: 3 blocos de 4 letras/números sem caracteres parecidos (0/O, 1/l).
const alfabeto = 'abcdefghjkmnpqrstuvwxyz23456789'
const senha = Array.from({ length: 3 }, () => Array.from({ length: 4 }, () => alfabeto[randomInt(alfabeto.length)]).join('')).join('-')
const salt = randomBytes(16)
const hash = `${salt.toString('hex')}:${scryptSync(senha, salt, 64).toString('hex')}`
console.log(JSON.stringify({ usuario, nome: nome || usuario, hash, senha }))
