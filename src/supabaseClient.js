import { createClient } from '@supabase/supabase-js'

// ─── Supabase usado APENAS para Storage (upload de imagens/videos) ──────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ompsghnddkiprozlrura.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_W9532ij2_4hNgiQ48k_COA_bMUfkcmI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const BUCKET = 'servicos'

/** Upload de arquivo (imagem ou video) → retorna URL publica */
export async function uploadFile(file, path) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
