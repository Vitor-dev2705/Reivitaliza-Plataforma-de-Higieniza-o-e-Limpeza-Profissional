// ─── API Client (Neon via Netlify Functions) ────────────────────────────────
// Substitui o acesso direto ao Supabase para todas as operacoes de banco.
// Supabase permanece APENAS para Storage (upload de arquivos).

const TOKEN_KEY = 'reivitaliza_token'

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`/.netlify/functions/${path}`, {
      headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options.headers },
      ...options,
    })
  } catch (networkErr) {
    throw new Error('Erro de conexao. Verifique se o servidor esta rodando.')
  }

  // Tenta parsear JSON, mas trata respostas vazias/HTML
  let data
  const text = await res.text()
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    // Resposta nao e JSON (404 HTML, erro do servidor, etc)
    if (res.status === 404) {
      throw new Error('Endpoint nao encontrado. Verifique se o netlify dev esta rodando.')
    }
    throw new Error(`Erro ${res.status}: Resposta inesperada do servidor.`)
  }

  if (!res.ok) throw new Error(data.error || `Erro ${res.status}`)
  return data
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function login(email, password) {
  const data = await request('api-auth', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.token)
  return data
}

export function logout() {
  setToken(null)
}

export async function verifyToken() {
  const token = getToken()
  if (!token) return null
  try {
    const data = await request('api-auth', { method: 'GET' })
    return data
  } catch {
    setToken(null)
    return null
  }
}

export function hasToken() {
  return !!getToken()
}

// ── Services ─────────────────────────────────────────────────────────────────
export async function fetchServices() {
  const data = await request('api-services', { method: 'GET' })
  return data.services || []
}

export async function createService(title, description) {
  const data = await request('api-services', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  })
  return data.service
}

export async function updateServiceField(id, field, value) {
  await request('api-services', {
    method: 'PUT',
    body: JSON.stringify({ id, field, value }),
  })
}

export async function deleteService(id) {
  await request('api-services', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
}

// ── Site Config ──────────────────────────────────────────────────────────────
export async function loadSiteConfig() {
  const data = await request('api-config', { method: 'GET' })
  return data.data || {}
}

export async function saveSiteConfig(config) {
  await request('api-config', {
    method: 'PUT',
    body: JSON.stringify({ data: config }),
  })
}

// ── Reviews ──────────────────────────────────────────────────────────────────
export async function fetchReviews() {
  const data = await request('api-reviews', { method: 'GET' })
  return data.reviews || []
}

export async function createReview(reviewData) {
  const data = await request('api-reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  })
  return data.review
}

export async function updateReview(id, fields) {
  await request('api-reviews', {
    method: 'PUT',
    body: JSON.stringify({ id, ...fields }),
  })
}

export async function deleteReview(id) {
  await request('api-reviews', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
}
