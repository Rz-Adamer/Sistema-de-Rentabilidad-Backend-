const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./modules/auth/auth.routes");
const empresaRoutes = require("./modules/empresa/empresa.routes");
const errorHandler = require("./modules/middlewares/errorHandler");

app.use(express.json());

// prefijos API
app.use("/api/auth", authRoutes);
app.use("/api/empresas", empresaRoutes);

// SIEMPRE AL FINAL
app.use(errorHandler);

module.exports = app;