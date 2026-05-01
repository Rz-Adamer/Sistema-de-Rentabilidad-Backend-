const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../../modules/middlewares/validationMiddleware');

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
