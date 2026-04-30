const usuarioRepository = require('./usuario.repository');
const bcrypt = require('bcrypt');

const getUsuarios = async (user) => {
  // 👑 admin ve todo
  if (user.rol === 'admin') {
    return await usuarioRepository.findOnlyDueno(user.id_usuario);
  }

  // 🏢 dueño solo su empresa
  if (user.rol === 'dueno') {
    return await usuarioRepository.findByEmpresa(user.id_empresa, user.id_usuario);
  }

  // ❌ otros roles no pueden
  const error = new Error('No autorizado');
  error.status = 403;
  throw error;
};

const createUsuario = async ({ nombre, email, password, id_empresa }) => {
  // 🔍 validar email único
  const existe = await usuarioRepository.findByEmail(email);

  if (existe) {
    const error = new Error('El email ya está registrado');
    error.status = 400;
    throw error;
  }

  // 🔒 encriptar contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // 👑 rol automático
  const rol = 'dueno';

  const usuario = await usuarioRepository.create({
    nombre,
    email,
    password: hashedPassword,
    rol,
    id_empresa
  });

  return usuario;
};

module.exports = {
  getUsuarios,
  createUsuario
};