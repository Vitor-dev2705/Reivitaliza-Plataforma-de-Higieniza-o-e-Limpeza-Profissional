import { neon } from '@neondatabase/serverless';

const ADMIN_TOKEN = process.env.NETLIFY_ADMIN_TOKEN;

export async function handler(event) {
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const auth = event.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '');
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return { statusCode: 401, body: 'Não autorizado' };
  }

  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  try {
    const { type, title, description, url, section } = JSON.parse(event.body || '{}');

    if (!type || !url || !section) {
      return { statusCode: 400, body: 'Campos obrigatórios: type, url, section' };
    }

    const [row] = await sql`
      INSERT INTO media (type, title, description, url, section)
      VALUES (${type}, ${title}, ${description}, ${url}, ${section})
      RETURNING *
    `;

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(row),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao salvar mídia' }) };
  }
}
