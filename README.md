# Gestão de Propostas de Projetos Académicos 

Este projeto consiste numa aplicação web desenvolvida para a Unidade Curricular de Programação Web Avançada. O sistema permite a gestão de propostas de "projeto final de curso" num contexto académico.

A solução implementa uma arquitetura **Client-Server**, separando o Frontend (SPA em Vue.js) do Backend (API REST em Node.js), com persistência de dados em **PostgreSQL**.

##  Funcionalidades

### Utilizadores Anónimos
- **Consultar Docentes:** Visualização da lista de docentes registados.

### Docentes (Utilizadores Autenticados)
- **Registo e Autenticação:** Criação de conta e login seguro.
- **Gestão de Propostas:**
  - Criar novas propostas de projeto.
  - Associar **Alunos** (relação N:M).
  - Associar **Coorientadores** (outros docentes) (relação N:M).
  - Definir **Palavras-Chave** (tags dinâmicas).
- **Dashboard Pessoal:** Consulta e eliminação das suas próprias propostas.

---

##  Tecnologias Utilizadas

### Backend (API REST)
- **Node.js** & **Express**: Servidor e gestão de rotas.
- **PostgreSQL**: Base de dados relacional.
- **pg**: Driver de conexão à base de dados (com Pool de ligações).
- **bcryptjs**: Hashing de passwords para segurança.
- **jsonwebtoken (JWT)**: Autenticação stateless baseada em tokens.
- **dotenv**: Gestão de variáveis de ambiente.

### Frontend (SPA)
- **Vue.js 3** (Composition API): Framework reativa.
- **Vite**: Build tool rápida.
- **Vue Router**: Gestão de navegação (rotas e guardas de autenticação).
- **Axios**: Cliente HTTP para comunicação com a API (com Interceptors).

---


```text
projeto-final/
│
├── database/
│   └── schema.sql             
│
├── backend/                  
│   ├── .env                  
│   ├── package.json
│   └── src/
│       ├── config/
│       │   └── db.js          
│       ├── controllers/
│       │   ├── authController.js      
│       │   ├── docenteController.js   
│       │   ├── alunoController.js     
│       │   └── propostaController.js  
│       ├── middleware/
│       │   └── authMiddleware.js      
│       ├── routes/
│       │   └── index.js      
│       └── server.js          
│
└── frontend/                 
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── style.css
        ├── main.js
        ├── App.vue
        ├── services/
        │   └── api.js         
        ├── router/
        │   └── index.js       
        └── views/
            ├── PublicDocentes.vue
            ├── Login.vue
            ├── Register.vue   
            ├── Dashboard.vue
            └── PropostaForm.vue
---

###  Pré-requisitos

Certifique-se de que tem instalado:
- [Node.js](https://nodejs.org/) (v16 ou superior)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

---

### Instalação e Execução

Siga os passos pela ordem indicada.

### 1. Configurar a Base de Dados

1. Aceda ao seu gestor de PostgreSQL (pgAdmin ou terminal).
2. Crie uma base de dados chamada `gestao_projetos`.
3. Execute o script SQL localizado em `database/schema.sql` para criar as tabelas e inserir dados de teste.

```bash
# Exemplo via terminal (opcional)
psql -U postgres -d gestao_projetos -f database/schema.sql
```

### 2. Configurar e Iniciar o Backend

1. Navegue até à pasta `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um ficheiro `.env` na raiz da pasta `backend` com o seguinte conteúdo (ajuste a password):
   ```env
   PORT=3000
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=gestao_projetos
   DB_PASSWORD=sua_password_aqui
   DB_PORT=5432
   JWT_SECRET=chave_secreta_projeto_academico
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```
   *O terminal deverá exibir: "Servidor a correr na porta 3000".*

### 3. Configurar e Iniciar o Frontend

1. Abra um **novo terminal** e navegue até à pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação:
   ```bash
   npm run dev
   ```
4. Abra o link fornecido no terminal (geralmente `http://localhost:5173`) no seu browser.

---

##  Documentação da API (Principais Endpoints)

| Método | Endpoint            | Descrição                          | Auth |
|--------|---------------------|------------------------------------|------|
| GET    | `/api/docentes`     | Lista todos os docentes            | Não  |
| POST   | `/api/auth/register`| Registo de novo docente            | Não  |
| POST   | `/api/auth/login`   | Login (retorna JWT)                | Não  |
| GET    | `/api/propostas`    | Lista propostas do docente logado  | Sim  |
| POST   | `/api/propostas`    | Cria nova proposta                 | Sim  |
| DELETE | `/api/propostas/:id`| Apaga uma proposta                 | Sim  |

---

##  Segurança e Decisões de Implementação

1. **Passwords:** As passwords nunca são guardadas em texto simples. É utilizado o `bcryptjs` para gerar hashes seguros.
2. **Integridade de Dados:** O sistema utiliza transações SQL (`BEGIN`, `COMMIT`, `ROLLBACK`) na criação de propostas. Isto garante que uma proposta só é gravada se todas as suas dependências (coorientadores, alunos, keywords) forem gravadas com sucesso.

3. **Proteção de Rotas:** O Frontend utiliza "Navigation Guards" do Vue Router para impedir acesso a páginas privadas sem token. O Backend verifica o token JWT em cada pedido protegido.



