const servicioRepository = require('./servicio.repository');

const getServiciosByEmpresa = async (empresaId) => {
  // 🔍 Obtener servicios de la empresa del usuario autenticado
  const servicios = await servicioRepository.findByEmpresaId(empresaId);

  return servicios;
};

const createServicio = async ({ nombre, descripcion, empresaId }) => {
  // 🔒 Validar que no exista ya un servicio con el mismo nombre en esta empresa
  const servicios = await servicioRepository.findByEmpresaId(empresaId);
  const existe = servicios.some(s => s.nombre.toLowerCase() === nombre.toLowerCase());

  if (existe) {
    const error = new Error('Ya existe un servicio con este nombre en tu empresa');
    error.status = 400;
    throw error;
  }

  // ✅ Crear nuevo servicio
  const servicio = await servicioRepository.create({
    nombre,
    descripcion,
    empresaId
  });

  return servicio;
};

module.exports = {
  getServiciosByEmpresa,
  createServicio
};
