const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).json({ error: 'Nenhum token fornecido.' });
    }

    const token = authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

    if (!token) {
        return res.status(403).json({ error: 'Token mal formatado.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Falha na autenticação do token.' });
        }
        // Guardar ID do docente no request
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    });
}

module.exports = verifyToken;