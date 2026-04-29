const express = require('express');
const router = express.Router();
const servicioController = require('./servicio.controller');
const { createServicioValidation } = require('./servicio.validation');
const auth = require('../../modules/middlewares/authMiddleware');
const role = require('../../modules/middlewares/roleMiddleware');

// GET /servicios - Obtener servicios de la empresa del usuario autenticado
// Solo usuarios con rol "dueno" pueden ver servicios
router.get(
  '/',
  auth,
  role('dueno'),
  servicioController.getServicios
);

// POST /servicios - Crear nuevo servicio
// Solo usuarios con rol "dueno" pueden crear servicios
router.post(
  '/',
  auth,
  role('dueno'),
  createServicioValidation,
  servicioController.createServicio
);

module.exports = router;