const express = require('express');
const router = express.Router();

const usuarioController = require('./usuario.controller');
const { createUsuarioValidation } = require('./usuario.validation');

const auth = require('../../modules/middlewares/authMiddleware');
const role = require('../../modules/middlewares/roleMiddleware');

// GET /usuarios
router.get(
    '/',
    auth,
    role('admin', 'dueno'),
    usuarioController.getUsuarios
);

// POST /usuarios (admin crea dueño)
router.post(
  '/',
  auth,
  role('admin'),
  createUsuarioValidation,
  usuarioController.createUsuario
);

module.exports = router;