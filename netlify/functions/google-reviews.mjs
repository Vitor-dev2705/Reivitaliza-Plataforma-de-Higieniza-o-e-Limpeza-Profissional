const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function handler(event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' }
  }

  const API_KEY  = process.env.GOOGLE_API_KEY
  const PLACE_ID = process.env.GOOGLE_PLACE_ID

  if (!API_KEY || !PLACE_ID) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Variaveis GOOGLE_API_KEY e GOOGLE_PLACE_ID nao configuradas.' }),
    }
  }

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${PLACE_ID}` +
    `&fields=reviews,rating,user_ratings_total` +
    `&language=pt-BR` +
    `&reviews_sort=newest` +
    `&key=${API_KEY}`

  try {
    const res  = await fetch(url)
    const data = await res.json()

    if (data.status !== 'OK') {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: `Google API: ${data.status}`, detail: data.error_message ?? '' }),
      }
    }

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        reviews:      data.result.reviews            ?? [],
        rating:       data.result.rating             ?? 0,
        totalRatings: data.result.user_ratings_total ?? 0,
      }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Erro interno ao buscar avaliacoes.', detail: err.message }),
    }
  }
}
