const pool = require("../../config/db");

/* ─── Alias helper ───────────────────────────────────────────────────────────
 * The physical DB column is "horas_trabajadas".
 * All SELECTs alias it as "horas" so the rest of the codebase (service,
 * controller, frontend) can keep using the name "horas" without changes.
 * ────────────────────────────────────────────────────────────────────────── */

const findByLider = async (liderId) => {
  try {
    const result = await pool.query(
      `SELECT
          rh.id_registro,
          rh.id_proyecto,
          rh.id_empleado,
          rh.fecha,
          rh.horas_trabajadas AS horas,
          rh.descripcion,
          rh.created_at,
          p.nombre AS proyecto_nombre,
          u.nombre AS empleado_nombre
       FROM registro_horas rh
       INNER JOIN proyecto p ON p.id_proyecto = rh.id_proyecto
       INNER JOIN usuario  u ON u.id_usuario  = rh.id_empleado
       WHERE EXISTS (
         SELECT 1 FROM proyecto_lider pl
         WHERE pl.id_proyecto = p.id_proyecto AND pl.id_lider = $1
       )
       ORDER BY rh.fecha DESC, rh.id_registro DESC`,
      [liderId]
    );
    return result.rows;
  } catch {
    // Fallback cuando proyecto_lider aún no existe
    const result = await pool.query(
      `SELECT
          rh.id_registro,
          rh.id_proyecto,
          rh.id_empleado,
          rh.fecha,
          rh.horas_trabajadas AS horas,
          rh.descripcion,
          rh.created_at,
          p.nombre AS proyecto_nombre,
          u.nombre AS empleado_nombre
       FROM registro_horas rh
       INNER JOIN proyecto p ON p.id_proyecto = rh.id_proyecto
       INNER JOIN usuario  u ON u.id_usuario  = rh.id_empleado
       WHERE p.id_lider = $1
       ORDER BY rh.fecha DESC, rh.id_registro DESC`,
      [liderId]
    );
    return result.rows;
  }
};

const findByEmpleado = async (empleadoId) => {
  const result = await pool.query(
    `SELECT
        rh.id_registro,
        rh.id_proyecto,
        rh.id_empleado,
        rh.fecha,
        rh.horas_trabajadas AS horas,
        rh.descripcion,
        rh.created_at,
        p.nombre AS proyecto_nombre
     FROM registro_horas rh
     INNER JOIN proyecto p ON p.id_proyecto = rh.id_proyecto
     WHERE rh.id_empleado = $1
     ORDER BY rh.fecha DESC, rh.id_registro DESC`,
    [empleadoId]
  );
  return result.rows;
};

const findByProyecto = async (proyectoId) => {
  const result = await pool.query(
    `SELECT
        rh.id_registro,
        rh.id_proyecto,
        rh.id_empleado,
        rh.fecha,
        rh.horas_trabajadas AS horas,
        rh.descripcion,
        rh.created_at,
        u.nombre AS empleado_nombre
     FROM registro_horas rh
     INNER JOIN usuario u ON u.id_usuario = rh.id_empleado
     WHERE rh.id_proyecto = $1
     ORDER BY rh.fecha DESC`,
    [proyectoId]
  );
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query(
    `SELECT
        id_registro,
        id_proyecto,
        id_empleado,
        fecha,
        horas_trabajadas AS horas,
        descripcion,
        created_at
     FROM registro_horas
     WHERE id_registro = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/* create receives { horas } and maps it to the physical column horas_trabajadas */
const create = async ({ id_proyecto, id_empleado, fecha, horas, descripcion }) => {
  const horasNum = Number(horas);
  if (!horasNum || isNaN(horasNum) || horasNum <= 0) {
    throw Object.assign(new Error("El valor de horas debe ser un número positivo"), { status: 422 });
  }
  const result = await pool.query(
    `INSERT INTO registro_horas (id_proyecto, id_empleado, fecha, horas_trabajadas, descripcion)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING
       id_registro,
       id_proyecto,
       id_empleado,
       fecha,
       horas_trabajadas AS horas,
       descripcion,
       created_at`,
    [id_proyecto, id_empleado, fecha, horasNum, descripcion || null]
  );
  return result.rows[0];
};

const update = async (id, { fecha, horas, descripcion }) => {
  const result = await pool.query(
    `UPDATE registro_horas
     SET fecha            = COALESCE($2, fecha),
         horas_trabajadas = COALESCE($3, horas_trabajadas),
         descripcion      = COALESCE($4, descripcion)
     WHERE id_registro = $1
     RETURNING
       id_registro,
       id_proyecto,
       id_empleado,
       fecha,
       horas_trabajadas AS horas,
       descripcion,
       created_at`,
    [id, fecha || null, horas ? Number(horas) : null, descripcion !== undefined ? descripcion : null]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query(
    "DELETE FROM registro_horas WHERE id_registro = $1 RETURNING id_registro",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  findByLider,
  findByEmpleado,
  findByProyecto,
  findById,
  create,
  update,
  remove,
};
