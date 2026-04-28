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

module.exports = {
  getEmpresas
};