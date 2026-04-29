const pool = require('../../config/db');

const findByEmpresaId = async (empresaId) => {
  const result = await pool.query(
    `SELECT id_servicio, nombre, descripcion
     FROM servicio
     WHERE id_empresa = $1 AND is_active = true
     ORDER BY nombre ASC`,
    [empresaId]
  );

  return result.rows;
};

const findById = async (servicioId) => {
  const result = await pool.query(
    `SELECT id_servicio, nombre, descripcion
     FROM servicio
     WHERE id_servicio = $1 AND is_active = true`,
    [servicioId]
  );

  return result.rows[0];
};

const create = async ({ nombre, descripcion, empresaId }) => {
  const result = await pool.query(
    `INSERT INTO servicio (nombre, descripcion, id_empresa)
     VALUES ($1, $2, $3)
     RETURNING id_servicio, nombre, descripcion, id_empresa`,
    [nombre, descripcion, empresaId]
  );

  return result.rows[0];
};

module.exports = {
  findByEmpresaId,
  findById,
  create
};
