const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./modules/auth/auth.routes");

const empresaRoutes = require("./modules/empresa/empresa.routes");
const servicioRoutes = require("./modules/servicio/servicio.routes");
const usuarioRoutes = require("./modules/usuario/usuario.routes");

const errorHandler = require("./modules/middlewares/errorHandler");

app.use(
  cors({
    origin: "http://localhost:3001",
  }),
);

app.use(express.json());

// prefijos API
app.use("/api/auth", authRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/usuarios", usuarioRoutes);

// SIEMPRE AL FINAL
app.use(errorHandler);

module.exports = app;
