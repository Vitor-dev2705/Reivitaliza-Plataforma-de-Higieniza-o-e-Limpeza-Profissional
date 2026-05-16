import { getSQL } from './helpers/db.mjs'
import { json, preflight, verifyAuth } from './helpers/auth.mjs'

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return preflight()

  const sql = getSQL()

  // GET → retorna config publica
  if (event.httpMethod === 'GET') {
    try {
      const rows = await sql`SELECT * FROM site_config WHERE id = 1 LIMIT 1`
      const config = rows.length > 0 ? rows[0].data : {}
      return json(200, { data: config })
    } catch (err) {
      return json(500, { error: 'Erro ao buscar config', detail: err.message })
    }
  }

  // PUT → atualizar config (requer auth)
  const user = verifyAuth(event)
  if (!user) return json(401, { error: 'Nao autorizado' })

  if (event.httpMethod === 'PUT') {
    try {
      let body = {}
      try {
        body = JSON.parse(event.body || '{}')
      } catch {
        return json(400, { error: 'Body JSON invalido' })
      }

      const value = JSON.stringify(body.data || {})
      await sql`
        INSERT INTO site_config (id, data)
        VALUES (1, ${value}::jsonb)
        ON CONFLICT (id)
        DO UPDATE SET data = ${value}::jsonb, updated_at = NOW()
      `
      return json(200, { success: true })
    } catch (err) {
      return json(500, { error: 'Erro ao salvar config', detail: err.message })
    }
  }

  return json(405, { error: 'Metodo nao permitido' })
}
