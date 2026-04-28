const express = require('express');
const router = express.Router();
const empresaController = require('./empresa.controller');

// GET /empresas
router.get('/', empresaController.getEmpresas);

module.exports = router;