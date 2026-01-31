const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Teste de ligação
pool.on('connect', () => {
    // console.log('Base de dados conectada com sucesso.');
});

pool.on('error', (err) => {
    console.error('Erro inesperado no cliente inativo', err);
    process.exit(-1);
});


module.exports = pool;
