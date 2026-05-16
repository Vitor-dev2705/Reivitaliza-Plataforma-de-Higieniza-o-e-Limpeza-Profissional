-- ============================================================
-- REIVITALIZA – Setup do banco Neon
-- Execute no Neon SQL Editor: https://console.neon.tech
-- ============================================================

-- 1. Tabela de servicos (antes/depois)
CREATE TABLE IF NOT EXISTS services (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL DEFAULT 'Novo Servico',
  description   TEXT DEFAULT '',
  before        TEXT,
  after         TEXT,
  before_video  TEXT,
  after_video   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Dados iniciais
INSERT INTO services (title, description, before, after) VALUES
  ('Sofas',                 'Limpeza profunda que remove manchas, odores e devolve o aspecto de novo ao seu sofa.',       '/assets/sofa_antes.jpg',    '/assets/sofa_depois.jpg'),
  ('Colchoes',              'Higienizacao completa contra acaros, bacterias e agentes alergicos.',                        '/assets/colchao_antes.jpg', '/assets/colchao_depois.jpg'),
  ('Estofados Automotivos', 'Limpeza profunda nos bancos, removendo sujeira pesada e renovando o interior do veiculo.',  '/assets/banco_sujo.jpg',    '/assets/banco_limpo.jpg'),
  ('Cadeiras',              'Revitalizacao completa que devolve conforto, higiene e aparencia original.',                 '/assets/cadeira_antes.jpg', '/assets/cadeira_depois.jpg')
ON CONFLICT DO NOTHING;

-- 2. Tabela de avaliacoes
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  rating      INT  NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  text        TEXT NOT NULL,
  photo_url   TEXT DEFAULT '',
  source      TEXT DEFAULT 'manual',
  visible     BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Configuracao extra do site (galerias, blocos)
CREATE TABLE IF NOT EXISTS site_config (
  id          INT PRIMARY KEY DEFAULT 1,
  data        JSONB DEFAULT '{}'::JSONB,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO site_config (id, data) VALUES (1, '{}') ON CONFLICT DO NOTHING;

-- ============================================================
-- Variaveis de ambiente necessarias no Netlify:
--
--   DATABASE_URL     = postgresql://neondb_owner:...@....neon.tech/neondb?sslmode=require
--   ADMIN_EMAIL      = email-do-dono@email.com
--   ADMIN_PASSWORD   = senha-segura-aqui
--   JWT_SECRET       = uma-string-aleatoria-longa
--   VITE_SUPABASE_URL       = https://xxx.supabase.co  (so pro storage)
--   VITE_SUPABASE_ANON_KEY  = sb_publishable_xxx       (so pro storage)
-- ============================================================
