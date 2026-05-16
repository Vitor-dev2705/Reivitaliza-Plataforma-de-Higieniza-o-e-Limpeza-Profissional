import { neon } from '@neondatabase/serverless'

let _sql = null

export function getSQL() {
  if (!_sql) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL nao configurada')
    _sql = neon(url)
  }
  return _sql
}
