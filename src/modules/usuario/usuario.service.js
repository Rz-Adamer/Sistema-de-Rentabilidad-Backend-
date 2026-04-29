const usuarioRepository = require('./usuario.repository');

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

module.exports = {
  getUsuarios
};