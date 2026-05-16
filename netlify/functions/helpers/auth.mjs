import jwt from 'jsonwebtoken'

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

/** Retorna headers CORS padrao */
export function cors() { return CORS }

/** Resposta JSON com CORS */
export function json(statusCode, body) {
  return { statusCode, headers: CORS, body: JSON.stringify(body) }
}

/** Resposta 204 para OPTIONS */
export function preflight() {
  return { statusCode: 204, headers: CORS, body: '' }
}

/** Verifica JWT do header Authorization. Retorna payload ou null */
export function verifyAuth(event) {
  const secret = process.env.JWT_SECRET
  if (!secret) return null

  const header = event.headers.authorization || event.headers.Authorization || ''
  if (!header.startsWith('Bearer ')) return null

  try {
    return jwt.verify(header.split(' ')[1], secret)
  } catch {
    return null
  }
}

/** Cria um JWT com 7 dias de validade */
export function signToken(payload) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET nao configurada')
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}
