const pool = require('../../config/db');

const findAll = async () => {
  const result = await pool.query(
    'SELECT id_empresa, nombre FROM empresa WHERE true'
  );

  return result.rows;
};

module.exports = {
  findAll
};