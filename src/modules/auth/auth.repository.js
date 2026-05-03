const pool = require("../../config/db");

//Buscar usuario por email (para validar email único)
const findUserByEmail = async (email) => {
    const query = `
    SELECT id_usuario, id_empresa, nombre, email, password, rol, is_active
    FROM usuario
    WHERE email = $1
    LIMIT 1
  `;

    const result = await pool.query(query, [email]);

    return result.rows[0] || null;
};

//Crear usuario en BD
const createOwner = async (id_empresa, nombre, email, hashedPassword, rol) => {
    const query = `
    INSERT INTO usuario (id_empresa, nombre, email, password, rol, is_active)
    VALUES ($1, $2, $3, $4, $5, true)
    RETURNING id_usuario, id_empresa, nombre, email, rol, is_active
  `;

    const result = await pool.query(query, [
        id_empresa,
        nombre,
        email,
        hashedPassword,
        rol,
    ]);

    return result.rows[0];
};

const findOwnerByEmpresaId = async (id_empresa) => {
    const query = `
    SELECT id_usuario, nombre, email, rol
    FROM usuario
    WHERE id_empresa = $1 AND rol = 'propietario' AND is_active = true
    LIMIT 1
  `;
    const result = await pool.query(query, [id_empresa]);
    return result.rows[0] || null;
};

module.exports = {
    findUserByEmail,
    createOwner,
    findOwnerByEmpresaId,
};