import { json, preflight, verifyAuth, signToken } from './helpers/auth.mjs'

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return preflight()

  // GET → verifica se o token atual e valido
  if (event.httpMethod === 'GET') {
    const user = verifyAuth(event)
    if (!user) return json(401, { error: 'Token invalido ou expirado' })
    return json(200, { valid: true, email: user.email })
  }

  // POST → login
  if (event.httpMethod === 'POST') {
    try {
      const { email, password } = JSON.parse(event.body || '{}')

      const adminEmail = process.env.ADMIN_EMAIL
      const adminPassword = process.env.ADMIN_PASSWORD

      if (!adminEmail || !adminPassword) {
        return json(500, { error: 'Credenciais admin nao configuradas no servidor' })
      }

      if (email !== adminEmail || password !== adminPassword) {
        return json(401, { error: 'Email ou senha incorretos' })
      }

      const token = signToken({ email, role: 'admin' })
      return json(200, { token, email })
    } catch (err) {
      return json(500, { error: 'Erro ao processar login', detail: err.message })
    }
  }

  return json(405, { error: 'Metodo nao permitido' })
}
