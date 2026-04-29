const pool = require("../../config/db");

const findById = async (usuarioId) => {
  const query = `
    SELECT id_usuario, nombre, email, rol, id_empresa, is_active
    FROM usuario
    WHERE id_usuario = $1 AND is_active = true
    LIMIT 1
  `;

  const result = await pool.query(query, [usuarioId]);

  return result.rows[0] || null;
};

// 👑 admin
const findOnlyDueno = async (currentUserId) => {
  const result = await pool.query(`
    SELECT 
      u.id_usuario,
      u.nombre,
      u.email,
      e.nombre AS empresa_nombre
    FROM usuario u
    INNER JOIN empresa e ON u.id_empresa = e.id_empresa
    WHERE u.rol = 'dueno'
      AND u.is_active = true
      AND u.id_usuario != $1
    ORDER BY u.id_usuario ASC
  `, [currentUserId]);

  return result.rows;
};

// 🏢 dueño
const findByEmpresa = async (id_empresa, currentUserId) => {
  const result = await pool.query(`
    SELECT id_usuario, nombre, email, rol
    FROM usuario
    WHERE id_empresa = $1 AND is_active = true
    AND id_usuario != $2
  `, [id_empresa, currentUserId]);

  return result.rows;
};

module.exports = {
  findById,
  findOnlyDueno,
  findByEmpresa
};
