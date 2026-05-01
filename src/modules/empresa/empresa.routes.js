const express = require('express');
const router = express.Router();

const empresaController = require('./empresa.controller');
const {
    createEmpresaValidation, 
    empresaIdParamValidation, 
    updateEmpresaValidation 
} = require('./empresa.validation');

const auth = require('../../modules/middlewares/authMiddleware');
const role = require('../../modules/middlewares/roleMiddleware');

// GET /empresas
router.get('/', auth, role('admin'), empresaController.getEmpresas);

// POST /empresas
router.post(
    '/',
    auth,
    role('admin'),
    createEmpresaValidation,
    empresaController.createEmpresa
);

// GET /empresas/:id
router.get('/:id', auth, role('admin', 'propietario'), empresaIdParamValidation, empresaController.getEmpresaById);

// PUT /empresas/:id
router.put(
    '/:id',
    auth,
    role('admin', 'propietario'),
    empresaIdParamValidation,
    updateEmpresaValidation,
    empresaController.updateEmpresa
);

module.exports = router;