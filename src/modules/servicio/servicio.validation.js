// Validaciones para los endpoints de servicio

const createServicioValidation = (req, res, next) => {
  const { nombre, descripcion } = req.body;

  // 🔒 Validar nombre
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'El nombre del servicio es requerido'
    });
  }

  if (nombre.length < 3) {
    return res.status(400).json({
      success: false,
      message: 'El nombre debe tener al menos 3 caracteres'
    });
  }

  // 🔒 Validar descripción (opcional pero si viene, debe tener mínimo)
  if (descripcion && descripcion.trim().length > 0 && descripcion.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'La descripción debe tener al menos 10 caracteres'
    });
  }

  next();
};

module.exports = {
  createServicioValidation
};
