-- ============================================================
-- REIVITALIZA – Script de configuração do banco Supabase
-- Execute no SQL Editor: https://supabase.com/dashboard
-- ============================================================

-- 1. Tabela de serviços (antes/depois)
CREATE TABLE IF NOT EXISTS services (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL DEFAULT 'Novo Serviço',
  description   TEXT DEFAULT '',
  before        TEXT,   -- URL da imagem "Antes"
  after         TEXT,   -- URL da imagem "Depois"
  before_video  TEXT,   -- URL do vídeo "Antes"
  after_video   TEXT,   -- URL do vídeo "Depois"
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Dados iniciais
INSERT INTO services (title, description, before, after) VALUES
  ('Sofás',                 'Limpeza profunda que remove manchas, odores e devolve o aspecto de novo ao seu sofá.',   '/assets/sofa_antes.jpg',    '/assets/sofa_depois.jpg'),
  ('Colchões',              'Higienização completa contra ácaros, bactérias e agentes alérgicos.',                    '/assets/colchao_antes.jpg', '/assets/colchao_depois.jpg'),
  ('Estofados Automotivos', 'Limpeza profunda nos bancos, removendo sujeira pesada e renovando o interior do veículo.', '/assets/banco_sujo.jpg',  '/assets/banco_limpo.jpg'),
  ('Cadeiras',              'Revitalização completa que devolve conforto, higiene e aparência original.',             '/assets/cadeira_antes.jpg', '/assets/cadeira_depois.jpg')
ON CONFLICT DO NOTHING;

-- 2. Tabela de avaliações manuais
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  rating      INT  NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  text        TEXT NOT NULL,
  photo_url   TEXT DEFAULT '',
  source      TEXT DEFAULT 'manual',  -- 'manual' ou 'google'
  visible     BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Configuração extra do site (galerias, blocos, etc.)
CREATE TABLE IF NOT EXISTS site_config (
  id    INT PRIMARY KEY DEFAULT 1,
  data  JSONB DEFAULT '{}'::JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO site_config (id, data) VALUES (1, '{}') ON CONFLICT DO NOTHING;

-- 4. Storage bucket para mídias
-- Crie manualmente em: Storage → New Bucket → Nome: "servicos" → Public: true
-- Ou execute (requer permissão de service_role):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('servicos', 'servicos', true) ON CONFLICT DO NOTHING;

-- 5. Políticas de acesso (Row Level Security)
ALTER TABLE services   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews    ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Leitura pública (visitantes podem ver serviços e avaliações visíveis)
CREATE POLICY "public_read_services"    ON services    FOR SELECT USING (true);
CREATE POLICY "public_read_reviews"     ON reviews     FOR SELECT USING (visible = true);
CREATE POLICY "public_read_site_config" ON site_config FOR SELECT USING (true);

-- Escrita apenas para usuários autenticados (o dono do site)
CREATE POLICY "auth_write_services"    ON services    FOR ALL    USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_reviews"     ON reviews     FOR ALL    USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_site_config" ON site_config FOR ALL    USING (auth.role() = 'authenticated');

-- ============================================================
-- Depois de rodar este SQL:
-- 1. Vá em Authentication → Users → Add User
-- 2. Crie o usuário admin com email e senha
-- 3. Vá em Storage → New Bucket → "servicos" → Public: ON
-- ============================================================
