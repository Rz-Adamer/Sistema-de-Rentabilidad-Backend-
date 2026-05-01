const bcrypt = require('bcrypt');
const usuarioRepository = require('./usuario.repository');
const historialRepository = require('../historial_horas/historial.repository');

const getUsuarios = async (user) => {
  // 👑 admin ve todo
  if (user.rol === 'admin') {
    return await usuarioRepository.findOnlypropietario(user.id_usuario);
  }

  // 🏢 propietario solo su empresa
  if (user.rol === 'propietario') {
    return await usuarioRepository.findByEmpresa(user.id_empresa, user.id_usuario);
  }

  // ❌ otros roles no pueden
  const error = new Error('No autorizado');
  error.status = 403;
  throw error;
};

const createUsuario = async (data, currentUser) => {
  const { nombre, email, password, rol, monto, tipo_pago, id_empresa } = data;

  // 📧 validar email único
  const existe = await usuarioRepository.findByEmail(email);
  if (existe) {
    const error = new Error('El email ya está registrado');
    error.status = 400;
    throw error;
  }

  let empresaFinal;

  let rolFinal;

  // 👑 rol por defecto si no viene (admin → propietario)
  if (currentUser.rol === 'admin') {
    rolFinal = 'propietario';
  } else {
    if (!rol) {
      throw new Error('Rol es obligatorio');
    }
    rolFinal = rol;
  }

  // 🔐 lógica por rol
  if (currentUser.rol === 'admin') {
    // admin debe indicar empresa
    if (!id_empresa) {
      throw new Error('Admin debe especificar la empresa');
    }

    // admin SOLO crea propietario
    if (rol && rol !== 'propietario') {
      throw new Error('Admin solo puede crear usuarios propietario');
    }

    empresaFinal = id_empresa;
  }

  // 🚨 validar único propietario por empresa
  if (rolFinal === 'propietario') {
    const existePropietario = await usuarioRepository.findPropietarioByEmpresa(empresaFinal);

    if (existePropietario) {
      const error = new Error('La empresa ya tiene un propietario');
      error.status = 400;
      throw error;
    }
  }

  if (currentUser.rol === 'propietario') {
    // propietario NO puede crear propietario
    if (rol === 'propietario') {
      throw new Error('propietario no puede crear otro propietario');
    }

    // empresa viene del token
    empresaFinal = currentUser.id_empresa;
  }

  // 🔐 reglas de sueldo
  if (rolFinal === 'empleado') {
    if (!monto || !tipo_pago) {
      throw new Error('Empleado requiere monto y tipo de pago');
    }
  } else {
    if (monto || tipo_pago) {
      throw new Error('Solo empleados pueden tener sueldo');
    }
  }

  // 🔒 encriptar contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // 👤 crear usuario
  const usuario = await usuarioRepository.create({
    nombre,
    email,
    password: hashedPassword,
    rol: rolFinal,
    id_empresa: empresaFinal
  });

  // 💰 historial si empleado
  if (rolFinal === 'empleado') {
    await historialRepository.create({
      id_usuario: usuario.id_usuario,
      tipo_pago,
      monto,
      fecha_inicio: new Date(),
      horas_mensuales: null
    });
  }

  return usuario;
};

module.exports = {
  getUsuarios,
  createUsuario
};