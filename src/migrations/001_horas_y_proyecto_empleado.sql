-- ============================================================
-- Migración 001: registro_horas y proyecto_empleado
-- Ejecutar en Supabase SQL Editor antes de usar el sistema
-- ============================================================

-- Tabla de registro de horas (puede ya existir con menos columnas)
CREATE TABLE IF NOT EXISTS registro_horas (
  id_registro  SERIAL        PRIMARY KEY,
  id_proyecto  INTEGER       NOT NULL REFERENCES proyecto(id_proyecto)  ON DELETE CASCADE,
  id_empleado  INTEGER       NOT NULL REFERENCES usuario(id_usuario)    ON DELETE CASCADE,
  fecha        DATE          NOT NULL,
  horas        NUMERIC(5,2)  NOT NULL CHECK (horas > 0 AND horas <= 24),
  descripcion  TEXT,
  created_at   TIMESTAMP     DEFAULT NOW(),
  updated_at   TIMESTAMP     DEFAULT NOW()
);

-- Si la tabla ya existía sin las columnas nuevas, agrégalas de forma segura:
ALTER TABLE registro_horas ADD COLUMN IF NOT EXISTS fecha       DATE;
ALTER TABLE registro_horas ADD COLUMN IF NOT EXISTS horas       NUMERIC(5,2);
ALTER TABLE registro_horas ADD COLUMN IF NOT EXISTS descripcion TEXT;
ALTER TABLE registro_horas ADD COLUMN IF NOT EXISTS created_at  TIMESTAMP DEFAULT NOW();
ALTER TABLE registro_horas ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMP DEFAULT NOW();

-- Tabla intermedia para asignación explícita de empleados a proyectos
CREATE TABLE IF NOT EXISTS proyecto_empleado (
  id          SERIAL   PRIMARY KEY,
  id_proyecto INTEGER  NOT NULL REFERENCES proyecto(id_proyecto) ON DELETE CASCADE,
  id_empleado INTEGER  NOT NULL REFERENCES usuario(id_usuario)   ON DELETE CASCADE,
  UNIQUE (id_proyecto, id_empleado)
);

-- Índices para mejorar performance en consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_registro_horas_empleado ON registro_horas (id_empleado);
CREATE INDEX IF NOT EXISTS idx_registro_horas_proyecto ON registro_horas (id_proyecto);
CREATE INDEX IF NOT EXISTS idx_proyecto_empleado_proyecto ON proyecto_empleado (id_proyecto);
CREATE INDEX IF NOT EXISTS idx_proyecto_empleado_empleado ON proyecto_empleado (id_empleado);
