const empresaRepository = require('./empresa.repository');

const getEmpresas = async () => {
  const empresas = await empresaRepository.findAll();

  // aquí podrías aplicar reglas si quieres
  return empresas;
};

const createEmpresa = async ({ nombre }) => {
  // 🔒 regla: no duplicados
  const existe = await empresaRepository.findByName(nombre);

  if (existe) {
    const error = new Error('La empresa ya existe');
    error.status = 400;
    throw error;
  }

  const empresa = await empresaRepository.create({ nombre });

  return empresa;
};

module.exports = {
  getEmpresas,
  createEmpresa
};