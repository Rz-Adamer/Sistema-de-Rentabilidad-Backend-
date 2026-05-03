const bcrypt = require("bcrypt");
const usuarioRepository = require("./usuario.repository");

const getOwners = async () => {
  return await usuarioRepository.findAllOwners();
};

const getUsuarios = async (user) => {
  if (user.rol === "propietario") {
    return await usuarioRepository.findByEmpresa(user.id_empresa, user.id_usuario);
  }
  if (user.rol === "lider") {
    return await usuarioRepository.findByEmpresa(user.id_empresa, user.id_usuario);
  }
  const error = new Error("No autorizado");
  error.status = 403;
  throw error;
};

const createUsuario = async (data, currentUser) => {
  const { nombre, email, password, rol } = data;

  if (currentUser.rol !== "propietario") {
    const error = new Error("No autorizado");
    error.status = 403;
    throw error;
  }

  if (!nombre || !email || !password || !rol) {
    const error = new Error("Todos los campos son obligatorios");
    error.status = 400;
    throw error;
  }

  if (!["lider", "empleado"].includes(rol)) {
    const error = new Error("Rol inválido");
    error.status = 400;
    throw error;
  }

  const existe = await usuarioRepository.findByEmail(email);
  if (existe) {
    const error = new Error("El email ya está registrado");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return await usuarioRepository.create({
    nombre,
    email,
    password: hashedPassword,
    rol,
    id_empresa: currentUser.id_empresa,
  });
};

const updateUsuario = async (id, data, currentUser) => {
  const target = await usuarioRepository.findById(id);
  if (!target) {
    const error = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  // Un usuario puede actualizar su propio perfil (solo nombre, email, password)
  if (currentUser.id_usuario === id) {
    // self-update allowed for any role
  } else if (currentUser.rol === "admin") {
    if (target.rol !== "propietario") {
      const error = new Error("El admin solo puede editar propietarios");
      error.status = 403;
      throw error;
    }
  } else if (currentUser.rol === "propietario") {
    if (target.id_empresa !== currentUser.id_empresa) {
      const error = new Error("No autorizado");
      error.status = 403;
      throw error;
    }
    if (target.rol === "propietario") {
      const error = new Error("No puedes editar propietarios");
      error.status = 403;
      throw error;
    }
  } else {
    const error = new Error("No autorizado");
    error.status = 403;
    throw error;
  }

  const { nombre, email, password, id_empresa, is_active, rol } = data;

  if (email && email !== target.email) {
    const existe = await usuarioRepository.findByEmail(email);
    if (existe) {
      const error = new Error("El email ya está en uso");
      error.status = 409;
      throw error;
    }
  }

  // Validar cambio de rol: propietario solo puede cambiar lider <-> empleado
  if (rol !== undefined && currentUser.rol === "propietario") {
    if (!["lider", "empleado"].includes(rol)) {
      const error = new Error("Rol inválido");
      error.status = 400;
      throw error;
    }
  }

  // Solo admin puede cambiar id_empresa e is_active de propietarios
  const updateData = {
    nombre: nombre || null,
    email:  email  || null,
    password: password ? await bcrypt.hash(password, 10) : null,
  };

  if (currentUser.rol === "admin") {
    if (id_empresa !== undefined) updateData.id_empresa = Number(id_empresa) || null;
    if (is_active  !== undefined) updateData.is_active  = Boolean(is_active);
  }
  if (currentUser.rol === "propietario" && rol !== undefined) {
    updateData.rol = rol;
  }

  return await usuarioRepository.update(id, updateData);
};

const deleteUsuario = async (id, currentUser) => {
  const target = await usuarioRepository.findById(id);
  if (!target) {
    const error = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  if (currentUser.rol === "admin") {
    if (target.rol !== "propietario") {
      const error = new Error("El admin solo puede eliminar propietarios");
      error.status = 403;
      throw error;
    }
  } else if (currentUser.rol === "propietario") {
    if (target.id_empresa !== currentUser.id_empresa) {
      const error = new Error("No autorizado");
      error.status = 403;
      throw error;
    }
    if (target.rol === "propietario") {
      const error = new Error("No puedes eliminar propietarios");
      error.status = 403;
      throw error;
    }
  } else {
    const error = new Error("No autorizado");
    error.status = 403;
    throw error;
  }

  return await usuarioRepository.deactivate(id);
};

const hardDeleteUsuario = async (id, currentUser) => {
  const target = await usuarioRepository.findById(id);
  if (!target) {
    const error = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  if (currentUser.rol === "admin") {
    if (target.rol !== "propietario") {
      const error = new Error("El admin solo puede eliminar propietarios");
      error.status = 403;
      throw error;
    }
  } else if (currentUser.rol === "propietario") {
    if (target.id_empresa !== currentUser.id_empresa) {
      const error = new Error("No autorizado");
      error.status = 403;
      throw error;
    }
    if (!["lider", "empleado"].includes(target.rol)) {
      const error = new Error("Solo puedes eliminar líderes y empleados");
      error.status = 403;
      throw error;
    }
  } else {
    const error = new Error("No autorizado");
    error.status = 403;
    throw error;
  }

  return await usuarioRepository.hardDelete(id);
};

module.exports = {
  getOwners,
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  hardDeleteUsuario,
};
