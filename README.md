
# API de Gestão Acadêmica

Esta API foi desenvolvida para a gestão acadêmica de alunos e disciplinas, utilizando Node.js, Express e Mongoose para interagir com um banco de dados MongoDB.

## Requisitos

- Node.js
- MongoDB

## Executando a API

Para iniciar o servidor, execute:
```bash
npm start
```

O servidor será iniciado na porta 3000 ou na porta especificada na variável de ambiente `PORT`.

## Endpoints

### Registrar Aluno

- **URL:** `/registrar`
- **Método:** `POST`
- **Descrição:** Registra um novo aluno.
- **Parâmetros:**
  - `nome` (string): Nome do aluno.
  - `email` (string): Email do aluno.
  - `senha` (string): Senha do aluno.
- **Exemplo de solicitação:**
    ```json
    {
        "nome": "João da Silva",
        "email": "joao@example.com",
        "senha": "senha123"
    }
    ```

### Autenticar Aluno

- **URL:** `/autenticar`
- **Método:** `POST`
- **Descrição:** Autentica um aluno e retorna um token JWT.
- **Parâmetros:**
  - `email` (string): Email do aluno.
  - `senha` (string): Senha do aluno.
- **Exemplo de solicitação:**
    ```json
    {
        "email": "joao@example.com",
        "senha": "senha123"
    }
    ```
- **Exemplo de resposta:**
    ```json
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### Matricular em Disciplina

- **URL:** `/matricular`
- **Método:** `POST`
- **Descrição:** Matricula um aluno em uma disciplina. Requer autenticação.
- **Cabeçalho:**
  - `Authorization: Bearer <token>`
- **Parâmetros:**
  - `disciplinaId` (string): ID da disciplina.
- **Exemplo de solicitação:**
    ```json
    {
        "disciplinaId": "60c72b2f9b1e8a3f88df8b2d"
    }
    ```

### Listar Disciplinas

- **URL:** `/disciplina`
- **Método:** `GET`
- **Descrição:** Lista todas as disciplinas.
- **Exemplo de resposta:**
    ```json
    [
        {
            "_id": "60c72b2f9b1e8a3f88df8b2d",
            "nome": "Matemática",
            "codigo": "MAT101",
            "professor": "Prof. Silva"
        },
        {
            "_id": "60c72b3e9b1e8a3f88df8b2e",
            "nome": "História",
            "codigo": "HIS102",
            "professor": "Prof. Souza"
        }
    ]
    ```

### Cadastrar Disciplina

- **URL:** `/disciplina`
- **Método:** `POST`
- **Descrição:** Cadastra uma nova disciplina.
- **Parâmetros:**
  - `nome` (string): Nome da disciplina.
  - `codigo` (string): Código da disciplina.
  - `professor` (string): Nome do professor.
- **Exemplo de solicitação:**
    ```json
    {
        "nome": "Física",
        "codigo": "FIS103",
        "professor": "Prof. Lima"
    }
    ```

## Modelos de Dados

### User

- **Campos:**
  - `nome` (string): Nome do aluno.
  - `email` (string): Email do aluno.
  - `senha` (string): Senha do aluno (hash).

### Disciplina

- **Campos:**
  - `nome` (string): Nome da disciplina.
  - `codigo` (string): Código da disciplina.
  - `professor` (string): Nome do professor.

### Matricula

- **Campos:**
  - `alunoId` (ObjectId): Referência ao aluno (User).
  - `disciplinaId` (ObjectId): Referência à disciplina (Disciplina).

## Dependências

- express
- mongoose
- bcrypt
- jsonwebtoken
