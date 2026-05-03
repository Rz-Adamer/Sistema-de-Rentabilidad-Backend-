// src/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Supabase siempre requiere SSL (dev y prod)
  ssl: { rejectUnauthorized: false },

  // ⚡ configuración del pool (optimización)
  max: 10, // máximo conexiones
  idleTimeoutMillis: 30000, // 30s
  connectionTimeoutMillis: 5000 // timeout conexión
});

// 🔍 Test de conexión inicial
pool.connect()
  .then(client => {
    console.log('✅ Conectado a PostgreSQL (Supabase)');
    client.release();
  })
  .catch(err => {
    console.error('❌ Error de conexión a la BD:', err.message);
  });

module.exports = pool;