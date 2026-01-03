import { neon } from '@neondatabase/serverless';

export async function handler(event) {
  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  try {
    const section = event.queryStringParameters?.section || null;

    const rows = section
      ? await sql`SELECT * FROM media WHERE section = ${section} ORDER BY created_at DESC`
      : await sql`SELECT * FROM media ORDER BY created_at DESC`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(rows),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao buscar mídias' }) };
  }
}
