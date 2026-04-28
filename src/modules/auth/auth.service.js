const { compare } = require("bcrypt");
const pool = require("../../config/db");
const { comparePassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");

const loginService = async (email, password) => {
  const query = `
    SELECT id_usuario, nombre, email, password, rol, is_active
    FROM usuario
    WHERE email = $1
    LIMIT 1
    `;

  const result = await pool.query(query, [email]);

  if (result.rows.length === 0) {
    throw new Error("CREDENCIALES_INVALIDAS");
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw new Error("USUARIO_INACTIVO");
  }

  const validPassword = await comparePassword(password, user.password);

  if (!validPassword) {
    throw new Error("CREDENCIALES_INVALIDAS");
  }

  const token = generateToken({
    id_usuario: user.id_usuario,
    email: user.email,
    rol: user.rol,
  });

  return {
    token,
    user: {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
  };
};

module.exports = { loginService };
