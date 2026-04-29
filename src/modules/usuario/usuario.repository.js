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

module.exports = {
  findById,
};
