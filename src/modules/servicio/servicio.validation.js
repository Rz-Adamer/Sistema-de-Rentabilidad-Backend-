const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

const createServicioValidation = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
    .trim(),

  body('descripcion')
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 500 }).withMessage('La descripción debe tener entre 3 y 500 caracteres')
    .trim(),

  handleValidationErrors
];

const updateServicioValidation = [
  body('nombre')
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
    .trim(),

  body('descripcion')
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 500 }).withMessage('La descripción debe tener entre 3 y 500 caracteres')
    .trim(),

  (req, res, next) => {
    const { nombre, descripcion } = req.body;
    if (!nombre && !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Debes enviar al menos nombre o descripción'
      });
    }
    next();
  },

  handleValidationErrors
];

const servicioIdParamValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de servicio inválido'),

  handleValidationErrors
];

module.exports = {
  createServicioValidation,
  updateServicioValidation,
  servicioIdParamValidation
};
