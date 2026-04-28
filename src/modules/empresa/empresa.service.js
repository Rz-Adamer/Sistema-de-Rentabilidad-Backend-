const empresaRepository = require('./empresa.repository');

const getEmpresas = async () => {
  const empresas = await empresaRepository.findAll();

  // aquí podrías aplicar reglas si quieres
  return empresas;
};

module.exports = {
  getEmpresas
};