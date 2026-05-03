const { body, validationResult } = require('express-validator');
const empresaRepository = require('../empresa/empresa.repository');
const { handleValidationErrors } = require('../../modules/middlewares/validationMiddleware');

const createUsuarioValidation = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('Mínimo 3 caracteres')
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .withMessage('El nombre solo debe contener letras y espacios')
        .trim(),

    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email inválido')
        .trim(),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
        .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
        .matches(/[a-z]/).withMessage('Debe contener al menos una minúscula')
        .matches(/[0-9]/).withMessage('Debe contener al menos un número')
        .matches(/[^A-Za-z0-9]/).withMessage('Debe contener un carácter especial')
        .trim(),

    body('id_empresa')
        .optional()
        .isInt().withMessage('Empresa inválida')
        .custom(async (value, { req }) => {
            // solo validar si viene (caso admin)
            if (value) {
                const empresa = await empresaRepository.findById(value);
                if (!empresa) {
                    throw new Error('La empresa no existe');
                }
            }
            return true;
        }),

    body('rol')
        .custom((value, { req }) => {
            const user = req.user;

            if (user.rol === 'admin') {
                // admin NO necesita enviar rol
                if (value && value !== 'propietario') {
                    throw new Error('Admin solo puede crear propietario');
                }
            }

            if (user.rol === 'propietario') {
                // propietario SÍ debe enviar rol
                if (!value) {
                    throw new Error('Rol es obligatorio');
                }

                if (value === 'propietario') {
                    throw new Error('No puede crear otro propietario');
                }
            }

            return true;
        }),

    body('monto')
        .optional()
        .isNumeric().withMessage('Monto inválido'),

    body('tipo_pago')
        .optional()
        .isIn(['mensual', 'por_hora'])
        .withMessage('Tipo de pago inválido o vacío'),

    handleValidationErrors
];

module.exports = {
    createUsuarioValidation
};