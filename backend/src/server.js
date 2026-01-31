const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const routes = require('./routes');

// Middlewares Globais
app.use(cors()); // Permitir pedidos do Vue (localhost:5173 -> localhost:3000)
app.use(express.json()); // Parse JSON bodies

// Rotas da API
app.use('/api', routes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});