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
    .isLength({ min: 3 }).withMessage('Mínimo 3 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .withMessage('El nombre solo debe contener letras y espacios'),

  body('descripcion')
    .optional({ checkFalsy: true })
    .isLength({ min: 10 }).withMessage('Mínimo 10 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .withMessage('La descripción solo debe contener letras y espacios'),

  handleValidationErrors
];

const servicioIdParamValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de servicio inválido'),

  handleValidationErrors
];

const updateServicioValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de servicio inválido'),

  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('Mínimo 3 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .withMessage('El nombre solo debe contener letras y espacios'),

  body('descripcion')
    .optional({ checkFalsy: true })
    .isLength({ min: 10 }).withMessage('Mínimo 10 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .withMessage('La descripción solo debe contener letras y espacios'),

  handleValidationErrors
];

module.exports = {
  createServicioValidation,
  updateServicioValidation,
  servicioIdParamValidation
};
