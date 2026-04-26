import { createClient } from '@supabase/supabase-js'

// ─── Configuração Supabase ────────────────────────────────────────────────────
// Substitua pelos valores do seu projeto em: https://supabase.com/dashboard
const SUPABASE_URL = 'https://ompsghnddkiprozlrura.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_W9532ij2_4hNgiQ48k_COA_bMUfkcmI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Storage helpers ──────────────────────────────────────────────────────────
const BUCKET = 'servicos'

/** Upload de arquivo (imagem ou vídeo) → retorna URL pública */
export async function uploadFile(file, path) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/** Salva/atualiza um campo de um serviço no banco */
export async function updateServiceField(id, field, value) {
  const { error } = await supabase.from('services').update({ [field]: value }).eq('id', id)
  if (error) throw error
}

/** Busca todos os serviços do banco */
export async function fetchServices() {
  const { data, error } = await supabase.from('services').select('*').order('id')
  if (error) throw error
  return data || []
}

/** Salva seções extras (galerias, blocos) na tabela site_config */
export async function saveSiteConfig(config) {
  const { error } = await supabase
    .from('site_config')
    .upsert({ id: 1, data: config }, { onConflict: 'id' })
  if (error) throw error
}

export async function loadSiteConfig() {
  const { data, error } = await supabase
    .from('site_config').select('data').eq('id', 1).single()
  if (error && error.code !== 'PGRST116') throw error
  return data?.data ?? null
}
