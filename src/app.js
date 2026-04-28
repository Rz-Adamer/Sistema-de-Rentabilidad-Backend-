const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./modules/auth/auth.routes");
const empresaRoutes = require("./modules/empresa/empresa.routes");

app.use(express.json());

// prefijo API

app.use("/api/auth", authRoutes);
app.use("/api/empresas", empresaRoutes);

module.exports = app;
