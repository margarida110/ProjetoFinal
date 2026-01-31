const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { nome, email, password } = req.body;

    // Validação básica
    if (!nome || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Verificar se email já existe
        const userExists = await pool.query('SELECT * FROM docentes WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ error: 'Email já registado.' });
        }

        // Hash da password (Custo 10)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserir na BD
        const newUser = await pool.query(
            'INSERT INTO docentes (nome, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
            [nome, email, hashedPassword]
        );

        res.status(201).json({ message: 'Docente registado com sucesso.', user: newUser.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor ao registar.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar utilizador
        const result = await pool.query('SELECT * FROM docentes WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Utilizador não encontrado.' });
        }

        const user = result.rows[0];

        // Comparar password (Bcrypt)
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Password inválida.' });
        }

        // Gerar Token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } // Expira em 8 horas
        );

        res.json({ 
            token, 
            user: { id: user.id, nome: user.nome, email: user.email } 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor ao efetuar login.' });
    }
};