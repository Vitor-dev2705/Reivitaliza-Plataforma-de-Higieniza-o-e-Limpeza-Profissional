import { getSQL } from './helpers/db.mjs'
import { json, preflight, verifyAuth } from './helpers/auth.mjs'

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return preflight()

  const sql = getSQL()

  // GET → lista publica de servicos
  if (event.httpMethod === 'GET') {
    try {
      const rows = await sql`SELECT * FROM services ORDER BY id`
      return json(200, { services: rows })
    } catch (err) {
      return json(500, { error: 'Erro ao buscar servicos', detail: err.message })
    }
  }

  // Abaixo requer autenticacao
  const user = verifyAuth(event)
  if (!user) return json(401, { error: 'Nao autorizado' })

  let body = {}
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Body JSON invalido' })
  }

  // POST → criar servico
  if (event.httpMethod === 'POST') {
    try {
      const title = body.title || 'Novo Servico'
      const description = body.description || ''
      const rows = await sql`
        INSERT INTO services (title, description)
        VALUES (${title}, ${description})
        RETURNING *
      `
      return json(201, { service: rows[0] })
    } catch (err) {
      return json(500, { error: 'Erro ao criar servico', detail: err.message })
    }
  }

  // PUT → atualizar campo de um servico
  if (event.httpMethod === 'PUT') {
    try {
      const { id, field, value } = body
      if (!id || !field) return json(400, { error: 'id e field sao obrigatorios' })

      const allowed = ['title', 'description', 'before', 'after', 'before_video', 'after_video']
      if (!allowed.includes(field)) return json(400, { error: `Campo '${field}' nao permitido` })

      switch (field) {
        case 'title':        await sql`UPDATE services SET title = ${value} WHERE id = ${id}`; break
        case 'description':  await sql`UPDATE services SET description = ${value} WHERE id = ${id}`; break
        case 'before':       await sql`UPDATE services SET "before" = ${value} WHERE id = ${id}`; break
        case 'after':        await sql`UPDATE services SET "after" = ${value} WHERE id = ${id}`; break
        case 'before_video': await sql`UPDATE services SET before_video = ${value} WHERE id = ${id}`; break
        case 'after_video':  await sql`UPDATE services SET after_video = ${value} WHERE id = ${id}`; break
      }
      return json(200, { success: true })
    } catch (err) {
      return json(500, { error: 'Erro ao atualizar servico', detail: err.message })
    }
  }

  // DELETE → remover servico
  if (event.httpMethod === 'DELETE') {
    try {
      const { id } = body
      if (!id) return json(400, { error: 'id e obrigatorio' })
      await sql`DELETE FROM services WHERE id = ${id}`
      return json(200, { success: true })
    } catch (err) {
      return json(500, { error: 'Erro ao remover servico', detail: err.message })
    }
  }

  return json(405, { error: 'Metodo nao permitido' })
}
