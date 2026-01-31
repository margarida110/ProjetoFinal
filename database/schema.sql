-- Limpar tabelas se existirem (para reset)
DROP TABLE IF EXISTS proposta_keywords, proposta_alunos, proposta_coorientadores, palavras_chave, propostas, alunos, docentes CASCADE;

-- 1. Tabela Docentes
CREATE TABLE docentes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela Alunos
CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    numero_estudante VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150)
);

-- 3. Tabela Propostas
CREATE TABLE propostas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    orientador_id INTEGER NOT NULL REFERENCES docentes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela Palavras-Chave (Dicionário de tags)
CREATE TABLE palavras_chave (
    id SERIAL PRIMARY KEY,
    expressao VARCHAR(50) UNIQUE NOT NULL
);

-- 5. Tabelas de Associação (Many-to-Many)

-- Associação Proposta <-> Coorientadores (Docentes)
CREATE TABLE proposta_coorientadores (
    proposta_id INTEGER REFERENCES propostas(id) ON DELETE CASCADE,
    docente_id INTEGER REFERENCES docentes(id) ON DELETE CASCADE,
    PRIMARY KEY (proposta_id, docente_id)
);

-- Associação Proposta <-> Alunos
CREATE TABLE proposta_alunos (
    proposta_id INTEGER REFERENCES propostas(id) ON DELETE CASCADE,
    aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
    PRIMARY KEY (proposta_id, aluno_id)
);

-- Associação Proposta <-> Palavras-Chave
CREATE TABLE proposta_keywords (
    proposta_id INTEGER REFERENCES propostas(id) ON DELETE CASCADE,
    keyword_id INTEGER REFERENCES palavras_chave(id) ON DELETE CASCADE,
    PRIMARY KEY (proposta_id, keyword_id)
);

-- Dados iniciais de teste (Seeds)
INSERT INTO alunos (nome, numero_estudante, email) VALUES 
('Ana Estudante', '2024001', 'ana@aluno.pt'),
('Bruno Caloiro', '2024002', 'bruno@aluno.pt'),
('Carla Finalista', '2024003', 'carla@aluno.pt');

-- Docente Padrão (Password: '123456') - Hash gerada para o exemplo
INSERT INTO docentes (nome, email, password_hash) VALUES 
('Professor Administrador', 'admin@univ.pt', '$2a$10$w.2Z0pQ9zF/O/z/Jz/z/JOz/z/z/z/z/z/z/z/z/z/z/z'); 
-- Nota: A hash acima é fictícia, cria um utilizador novo via aplicação para testar o login real.