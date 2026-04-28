const express = require('express');
const app = express();

const empresaRoutes = require('./modules/empresa/empresa.routes');

app.use(express.json());

// prefijo API
app.use('/api/empresas', empresaRoutes);

module.exports = app;