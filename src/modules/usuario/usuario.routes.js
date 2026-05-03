const express = require("express");
const router = express.Router();

const usuarioController = require("./usuario.controller");
const { createUsuarioValidation } = require("./usuario.validation");

const auth = require("../../modules/middlewares/authMiddleware");
const role = require("../../modules/middlewares/roleMiddleware");

// GET /usuarios/propietarios — solo admin
router.get("/propietarios", auth, role("admin"), usuarioController.getOwners);

// GET /usuarios — propietario (todos sus users) y lider (solo empleados de su empresa)
router.get("/", auth, role("propietario", "lider"), usuarioController.getUsuarios);

// POST /usuarios — propietario crea lider/empleado
router.post("/", auth, role("propietario"), createUsuarioValidation, usuarioController.createUsuario);

// PUT /usuarios/:id — admin y propietario (y self-update para cualquier rol)
router.put("/:id", auth, role("admin", "propietario", "lider", "empleado"), usuarioController.updateUsuario);

// DELETE /usuarios/:id — desactivar (soft delete)
router.delete("/:id", auth, role("admin", "propietario"), usuarioController.deleteUsuario);

// DELETE /usuarios/:id/permanente — eliminar físicamente (hard delete)
router.delete("/:id/permanente",  auth, role("admin", "propietario"), usuarioController.hardDeleteUsuario);

// DELETE /usuarios/:id/hard-delete — alias used by the frontend
router.delete("/:id/hard-delete", auth, role("admin", "propietario"), usuarioController.hardDeleteUsuario);

module.exports = router;
