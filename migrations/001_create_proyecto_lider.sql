-- ============================================================
-- Migration 001: Many-to-many leaders per project
-- Run once against the database before deploying the new code
-- ============================================================

-- 1. Create the junction table
CREATE TABLE IF NOT EXISTS proyecto_lider (
  id_proyecto INTEGER NOT NULL REFERENCES proyecto(id_proyecto) ON DELETE CASCADE,
  id_lider    INTEGER NOT NULL REFERENCES usuario(id_usuario)   ON DELETE CASCADE,
  PRIMARY KEY (id_proyecto, id_lider)
);

-- 2. Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_proyecto_lider_lider   ON proyecto_lider(id_lider);
CREATE INDEX IF NOT EXISTS idx_proyecto_lider_proyecto ON proyecto_lider(id_proyecto);

-- 3. Migrate existing single-leader data into the new table
INSERT INTO proyecto_lider (id_proyecto, id_lider)
SELECT id_proyecto, id_lider
FROM proyecto
WHERE id_lider IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================================
-- The id_lider column in proyecto is kept as a convenience
-- field pointing to the primary (first) leader.
-- All leader lookups should use proyecto_lider as source of truth.
-- ============================================================
