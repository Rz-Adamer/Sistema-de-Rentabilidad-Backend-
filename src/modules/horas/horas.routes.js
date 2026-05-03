const express = require("express");
const router = express.Router();
const horasController = require("./horas.controller");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

// GET /horas/lider — lider ve todas las horas de los proyectos que lidera
router.get("/lider", auth, role("lider"), horasController.getHorasByLider);

// GET /horas/mis-horas — empleado ve sus propios registros
router.get("/mis-horas", auth, role("empleado"), horasController.getMisHoras);

// POST /horas — empleado registra horas en un proyecto
router.post("/", auth, role("empleado"), horasController.createHora);

// PUT /horas/:id — empleado edita su propio registro
router.put("/:id", auth, role("empleado"), horasController.updateHora);

// DELETE /horas/:id — empleado elimina su propio registro
router.delete("/:id", auth, role("empleado"), horasController.deleteHora);

module.exports = router;
