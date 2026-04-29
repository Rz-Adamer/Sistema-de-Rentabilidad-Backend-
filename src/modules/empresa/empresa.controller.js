const empresaService = require('./empresa.service');

const getEmpresas = async (req, res, next) => {
  try {
    const empresas = await empresaService.getEmpresas();

    res.status(200).json({
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

    const nuevaEmpresa = await empresaService.createEmpresa({ nombre });

    res.status(201).json({
      success: true,
      data: nuevaEmpresa
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmpresas,
  createEmpresa
};