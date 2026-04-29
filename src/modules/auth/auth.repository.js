const pool = require("../../config/db");

const findUserByEmail = async(email) => {
    const query = `
    SELECT id_usuario, nombre, email, password, rol, is_active
    FROM usuario
    WHERE email = $1
    LIMIT 1
  `;

    const result = await pool.query(query, [email]);

    return result.rows[0] || null;
};

module.exports = {
    findUserByEmail,
};