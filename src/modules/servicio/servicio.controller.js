const servicioService = require('./servicio.service');
const usuarioRepository = require('../usuario/usuario.repository');

const getServicios = async (req, res, next) => {
  try {
    // 📌 Verificar que el usuario esté autenticado
    if (!req.user || !req.user.id_usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const { id_usuario } = req.user;

    // 🔍 Obtener usuario completo para asegurar id_empresa
    const userDB = await usuarioRepository.findById(id_usuario);

    if (!userDB) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!userDB.id_empresa) {
      return res.status(400).json({
        success: false,
        message: 'El usuario no tiene una empresa asociada'
      });
    }

    const empresaId = userDB.id_empresa;

    // 🔍 Obtener servicios filtrados por empresa
    const servicios = await servicioService.getServiciosByEmpresa(empresaId);

    return res.status(200).json({
      success: true,
      data: servicios
    });

  } catch (error) {
    next(error);
  }
};

const createServicio = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;

    // 📌 Verificar que el usuario esté autenticado
    if (!req.user || !req.user.id_usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const { id_usuario } = req.user;

    // 🔍 Obtener empresa del usuario desde BD
    const userDB = await usuarioRepository.findById(id_usuario);

    if (!userDB) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!userDB.id_empresa) {
      return res.status(400).json({
        success: false,
        message: 'El usuario no tiene una empresa asociada'
      });
    }

    const nuevoServicio = await servicioService.createServicio({
      nombre,
      descripcion,
      empresaId: userDB.id_empresa
    });

    return res.status(201).json({
      success: true,
      data: nuevoServicio
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServicios,
  createServicio
};