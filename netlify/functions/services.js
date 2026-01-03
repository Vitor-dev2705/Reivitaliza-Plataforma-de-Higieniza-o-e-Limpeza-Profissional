import { neon } from '@neondatabase/serverless';

export async function handler(event, context) {
  const sql = neon(process.env.NETLIFY_DATABASE_URL); // ← já vem do Neon/Netlify

  try {
    const services = await sql`SELECT * FROM services ORDER BY id`; // ajuste o nome da tabela
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(services),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao consultar banco' }),
    };
  }
}
