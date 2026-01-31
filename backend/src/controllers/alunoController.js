const pool = require('../config/db');

exports.getAllAlunos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM alunos ORDER BY nome ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar alunos.' });
    }
};