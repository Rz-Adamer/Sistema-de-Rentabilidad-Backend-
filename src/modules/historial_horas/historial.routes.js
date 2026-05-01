const express = require('express');
const router = express.Router();

const historialController = require('./historial.controller');
const { createHistorialValidation } = require('./historial.validation');

const auth = require('../../modules/middlewares/authMiddleware');
const role = require('../../modules/middlewares/roleMiddleware');

// POST /historiales
router.post(
    '/',
    auth,
    role('propietario'),
    createHistorialValidation,
    historialController.createHistorial
);

module.exports = router;