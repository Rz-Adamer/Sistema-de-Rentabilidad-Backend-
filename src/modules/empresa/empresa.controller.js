const empresaService = require('./empresa.service');

const getEmpresas = async (req, res, next) => {
  try {
    // 📌 Verificar que el usuario esté autenticado
    if (!req.user || !req.user.id_usuario) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    const empresas = await empresaService.getEmpresas();

    // ✅ Caso: no hay empresas registradas
    if (empresas.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No hay empresas disponibles",
        data: [],
      });
    }

    // ✅ Caso: hay empresas
    return res.status(200).json({
      success: true,
      data: empresas
    });
  } catch (error) {
    next(error); // lo maneja errorHandler
  }
};

const createEmpresa = async (req, res, next) => {
  try {
    const { nombre } = req.body;

    // 📌 Verificar que el usuario esté autenticado
    if (!req.user || !req.user.id_usuario) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    const nuevaEmpresa = await empresaService.createEmpresa({ nombre });

    res.status(201).json({
      success: true,
      data: nuevaEmpresa
    });
  } catch (error) {
    next(error);
  }
};

const getEmpresaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const empresa = await empresaService.getEmpresaById({ id, user: req.user });

    res.status(200).json({
      success: true,
      data: empresa
    });
  } catch (error) {
    next(error);
  }
};

const updateEmpresa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const empresaActualizada = await empresaService.updateEmpresa({
      id,
      nombre,
      user: req.user
    });

    res.status(200).json({
      success: true,
      data: empresaActualizada
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmpresas,
  createEmpresa,
  getEmpresaById,
  updateEmpresa
};