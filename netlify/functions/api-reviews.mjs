import { getSQL } from './helpers/db.mjs'
import { json, preflight, verifyAuth } from './helpers/auth.mjs'

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return preflight()

  const sql = getSQL()
  const user = verifyAuth(event)

  // GET → reviews (admin ve todos, visitante ve so visible)
  if (event.httpMethod === 'GET') {
    try {
      let rows
      if (user) {
        rows = await sql`SELECT * FROM reviews ORDER BY id DESC`
      } else {
        rows = await sql`SELECT * FROM reviews WHERE visible = true ORDER BY id DESC`
      }
      return json(200, { reviews: rows })
    } catch (err) {
      return json(500, { error: 'Erro ao buscar reviews', detail: err.message })
    }
  }

  // Abaixo requer auth
  if (!user) return json(401, { error: 'Nao autorizado' })

  let body = {}
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Body JSON invalido' })
  }

  // POST → criar review
  if (event.httpMethod === 'POST') {
    try {
      const { name, text, rating, visible, photo_url } = body
      const rows = await sql`
        INSERT INTO reviews (name, text, rating, visible, photo_url)
        VALUES (${name || 'Cliente'}, ${text || ''}, ${rating || 5}, ${visible !== false}, ${photo_url || ''})
        RETURNING *
      `
      return json(201, { review: rows[0] })
    } catch (err) {
      return json(500, { error: 'Erro ao criar review', detail: err.message })
    }
  }

  // PUT → atualizar review
  if (event.httpMethod === 'PUT') {
    try {
      const { id, name, text, rating, visible, photo_url } = body
      if (!id) return json(400, { error: 'id e obrigatorio' })

      await sql`
        UPDATE reviews SET
          name = COALESCE(${name}, name),
          text = COALESCE(${text}, text),
          rating = COALESCE(${rating}, rating),
          visible = COALESCE(${visible}, visible),
          photo_url = COALESCE(${photo_url}, photo_url)
        WHERE id = ${id}
      `
      return json(200, { success: true })
    } catch (err) {
      return json(500, { error: 'Erro ao atualizar review', detail: err.message })
    }
  }

  // DELETE → remover review
  if (event.httpMethod === 'DELETE') {
    try {
      const { id } = body
      if (!id) return json(400, { error: 'id e obrigatorio' })
      await sql`DELETE FROM reviews WHERE id = ${id}`
      return json(200, { success: true })
    } catch (err) {
      return json(500, { error: 'Erro ao remover review', detail: err.message })
    }
  }

  return json(405, { error: 'Metodo nao permitido' })
}
