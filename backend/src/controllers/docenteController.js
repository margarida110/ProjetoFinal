const pool = require('../config/db');

exports.getAllDocentes = async (req, res) => {
    try {
        // Não retornar a hash da password!
        const result = await pool.query('SELECT id, nome, email FROM docentes ORDER BY nome ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar docentes.' });
    }
};