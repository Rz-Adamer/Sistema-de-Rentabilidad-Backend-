const express = require('express');
const router = express.Router();

const usuarioController = require('./usuario.controller');

const auth = require('../../modules/middlewares/authMiddleware');
const role = require('../../modules/middlewares/roleMiddleware');

// GET /usuarios
router.get(
    '/',
    auth,
    role('admin', 'dueno'),
    usuarioController.getUsuarios
);

module.exports = router;