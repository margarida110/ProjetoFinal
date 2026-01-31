const pool = require('../config/db');

// Listar propostas do docente autenticado
exports.getMyPropostas = async (req, res) => {
    const docenteId = req.userId;
    try {
        const query = `
            SELECT p.id, p.titulo, p.descricao, p.created_at,
                   (SELECT json_agg(json_build_object('id', a.id, 'nome', a.nome)) 
                    FROM proposta_alunos pa JOIN alunos a ON pa.aluno_id = a.id 
                    WHERE pa.proposta_id = p.id) as alunos,
                   (SELECT json_agg(json_build_object('id', d.id, 'nome', d.nome)) 
                    FROM proposta_coorientadores pc JOIN docentes d ON pc.docente_id = d.id 
                    WHERE pc.proposta_id = p.id) as coorientadores,
                   (SELECT json_agg(kw.expressao) 
                    FROM proposta_keywords pk JOIN palavras_chave kw ON pk.keyword_id = kw.id 
                    WHERE pk.proposta_id = p.id) as keywords
            FROM propostas p
            WHERE p.orientador_id = $1
            ORDER BY p.created_at DESC
        `;
        const result = await pool.query(query, [docenteId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar propostas.' });
    }
};

// Criar nova proposta 
exports.createProposta = async (req, res) => {
    const { titulo, descricao, alunosIds, coorientadoresIds, keywords } = req.body;
    const orientadorId = req.userId;

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar Transação

        // 1. Inserir Proposta
        const propResult = await client.query(
            'INSERT INTO propostas (titulo, descricao, orientador_id) VALUES ($1, $2, $3) RETURNING id',
            [titulo, descricao, orientadorId]
        );
        const propostaId = propResult.rows[0].id;

        // 2. Inserir Coorientadores (se houver)
        if (coorientadoresIds && coorientadoresIds.length > 0) {
            for (const docId of coorientadoresIds) {
                await client.query(
                    'INSERT INTO proposta_coorientadores (proposta_id, docente_id) VALUES ($1, $2)',
                    [propostaId, docId]
                );
            }
        }

        // 3. Inserir Alunos (se houver)
        if (alunosIds && alunosIds.length > 0) {
            for (const alunoId of alunosIds) {
                await client.query(
                    'INSERT INTO proposta_alunos (proposta_id, aluno_id) VALUES ($1, $2)',
                    [propostaId, alunoId]
                );
            }
        }

        // 4. Inserir Palavras-Chave 
        if (keywords && keywords.length > 0) {
            for (let word of keywords) {
                word = word.trim();
                if (!word) continue;

                // Tentar encontrar ID
                let kwRes = await client.query('SELECT id FROM palavras_chave WHERE expressao = $1', [word]);
                let kwId;

                if (kwRes.rows.length > 0) {
                    kwId = kwRes.rows[0].id;
                } else {
                    // Criar nova
                    const newKw = await client.query('INSERT INTO palavras_chave (expressao) VALUES ($1) RETURNING id', [word]);
                    kwId = newKw.rows[0].id;
                }

                // Ligar à proposta
                await client.query(
                    'INSERT INTO proposta_keywords (proposta_id, keyword_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [propostaId, kwId]
                );
            }
        }

        await client.query('COMMIT'); // Confirmar Transação
        res.status(201).json({ message: 'Proposta criada com sucesso.', id: propostaId });

    } catch (err) {
        await client.query('ROLLBACK'); // Reverter tudo se houver erro
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar proposta.' });
    } finally {
        client.release();
    }
};

// Apagar proposta
exports.deleteProposta = async (req, res) => {
    const { id } = req.params;
    const orientadorId = req.userId;

    try {
        // Verificar se a proposta pertence ao docente
        const result = await pool.query(
            'DELETE FROM propostas WHERE id = $1 AND orientador_id = $2 RETURNING id',
            [id, orientadorId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Proposta não encontrada ou sem permissão.' });
        }

        res.json({ message: 'Proposta eliminada com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao eliminar proposta.' });
    }
};