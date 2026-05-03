const express = require("express");
const router = express.Router();

const { login } = require("../auth/auth.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const authController = require("./auth.controller");

router.post("/login", login);

//admin crea propietario
router.post(
    "/register-propietario",
    authMiddleware,
    roleMiddleware("admin"),
    authController.registerOwner,
);

// POST /auth/get-owner-contact — público, recibe email y retorna email del propietario
router.post("/get-owner-contact", authController.getOwnerContact);

module.exports = router;