const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./modules/auth/auth.routes");
const empresaRoutes = require("./modules/empresa/empresa.routes");
const servicioRoutes = require("./modules/servicio/servicio.routes");
const errorHandler = require('./modules/middlewares/errorHandler');
const errorHandler = require("./modules/middlewares/errorHandler");

app.use(express.json());

// prefijos API
app.use("/api/auth", authRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/servicios", servicioRoutes);

// SIEMPRE AL FINAL
app.use(errorHandler);

module.exports = app;