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
  role('admin', 'propietario'),
  usuarioController.getUsuarios
);

// POST /usuarios (admin crea propietario)
router.post(
  '/',
  auth,
  role('admin', 'propietario'), // ambos pueden entrar
  createUsuarioValidation,
  usuarioController.createUsuario
);

module.exports = router;