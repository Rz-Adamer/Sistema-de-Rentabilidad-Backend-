const pool = require('../../config/db');

const findAll = async () => {
  const result = await pool.query(
    'SELECT id_empresa, nombre FROM empresa WHERE true'
  );

  return result.rows;
};

const findByName = async (nombre) => {
  const result = await pool.query(
    'SELECT * FROM empresa WHERE nombre = $1',
    [nombre]
  );

  return result.rows[0];
};

const create = async ({ nombre }) => {
  const result = await pool.query(
    `INSERT INTO empresa (nombre)
     VALUES ($1)
     RETURNING id_empresa, nombre`,
    [nombre]
  );

  return result.rows[0];
};

module.exports = {
  findAll,
  findByName,
  create
};