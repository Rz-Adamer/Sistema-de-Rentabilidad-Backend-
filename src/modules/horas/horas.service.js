const horasRepository = require("./horas.repository");
const proyectoRepository = require("../proyecto/proyecto.repository");

const getHorasByLider = async (liderId) => {
  return await horasRepository.findByLider(liderId);
};

const getMisHoras = async (empleadoId) => {
  return await horasRepository.findByEmpleado(empleadoId);
};

const createHora = async (data, user) => {
  const { id_proyecto, fecha, horas, descripcion } = data;

  if (!id_proyecto || !fecha || horas === undefined) {
    const err = new Error("Proyecto, fecha y horas son requeridos");
    err.status = 400;
    throw err;
  }

  const horasNum = Number(horas);
  if (isNaN(horasNum) || horasNum <= 0 || horasNum > 24) {
    const err = new Error("Las horas deben ser un número entre 0.1 y 24");
    err.status = 422;
    throw err;
  }

  const proyecto = await proyectoRepository.findById(Number(id_proyecto));
  if (!proyecto) {
    const err = new Error("Proyecto no encontrado");
    err.status = 404;
    throw err;
  }

  return await horasRepository.create({
    id_proyecto: Number(id_proyecto),
    id_empleado: user.id_usuario,
    fecha,
    horas: horasNum,
    descripcion,
  });
};

const updateHora = async (id, data, user) => {
  const hora = await horasRepository.findById(id);
  if (!hora) {
    const err = new Error("Registro no encontrado");
    err.status = 404;
    throw err;
  }

  if (hora.id_empleado !== user.id_usuario) {
    const err = new Error("No puedes editar registros de otros empleados");
    err.status = 403;
    throw err;
  }

  const { fecha, horas, descripcion } = data;

  if (horas !== undefined) {
    const horasNum = Number(horas);
    if (isNaN(horasNum) || horasNum <= 0 || horasNum > 24) {
      const err = new Error("Las horas deben ser un número entre 0.1 y 24");
      err.status = 422;
      throw err;
    }
  }

  return await horasRepository.update(id, {
    fecha: fecha || null,
    horas: horas !== undefined ? Number(horas) : null,
    descripcion,
  });
};

const deleteHora = async (id, user) => {
  const hora = await horasRepository.findById(id);
  if (!hora) {
    const err = new Error("Registro no encontrado");
    err.status = 404;
    throw err;
  }

  if (hora.id_empleado !== user.id_usuario) {
    const err = new Error("No puedes eliminar registros de otros empleados");
    err.status = 403;
    throw err;
  }

  return await horasRepository.remove(id);
};

module.exports = {
  getHorasByLider,
  getMisHoras,
  createHora,
  updateHora,
  deleteHora,
};
