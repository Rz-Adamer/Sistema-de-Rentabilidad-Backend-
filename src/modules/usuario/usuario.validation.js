const { body, validationResult } = require('express-validator');

const createUsuarioValidation = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('Mínimo 3 caracteres')
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .withMessage('El nombre solo debe contener letras y espacios'),

    body('email')
        .isEmail().withMessage('Email inválido'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
        .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
        .matches(/[a-z]/).withMessage('Debe contener al menos una minúscula')
        .matches(/[0-9]/).withMessage('Debe contener al menos un número')
        .matches(/[^A-Za-z0-9]/).withMessage('Debe contener un carácter especial'),

    body('id_empresa')
        .isInt().withMessage('Empresa inválida'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

module.exports = {
    createUsuarioValidation
};