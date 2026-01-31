const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const docenteController = require('../controllers/docenteController');
const propostaController = require('../controllers/propostaController');
const alunoController = require('../controllers/alunoController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas Públicas
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/docentes', docenteController.getAllDocentes); // Anónimos consultam docentes

// Rotas Protegidas (Requer Token)
router.get('/alunos', authMiddleware, alunoController.getAllAlunos); // Helper para formulário
router.get('/propostas', authMiddleware, propostaController.getMyPropostas);
router.post('/propostas', authMiddleware, propostaController.createProposta);
router.delete('/propostas/:id', authMiddleware, propostaController.deleteProposta);

module.exports = router;