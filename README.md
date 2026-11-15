# DiárioMGM

Sistema escolar da Escola Municipal Murillo Garcia Moreira: chamada, frequência, notas, boletim em PDF, alocação de salas e horários e histórico completo do aluno. Projeto da disciplina CSI410 – Engenharia de Software II (UFOP), de Lucas Emanuel Cota Carneiro.

**Situação (Etapa 2):** esqueleto executável. O único fluxo implementado é a base da história H01: cadastrar e listar um aluno, da tela React até o PostgreSQL. As decisões estão em [`docs/adr`](docs/adr).

> **Dados fictícios:** o sistema lida com menores de idade. Nunca use nomes ou dados reais de alunos em testes, exemplos, seeds ou commits.

## Como executar

Requisitos: Docker com Compose.

```bash
cp .env.example .env   # opcional: há valores padrão de desenvolvimento
docker compose up --build
```

- Interface: <http://localhost:8080>
- API: <http://localhost:3000> (`GET /saude`, `GET /alunos`, `POST /alunos` com `{"nome": "..."}`)
- PostgreSQL: `localhost:5433` (usuário e senha em `.env.example`)

As migrations rodam sozinhas na subida da API.

## Como testar

Requisitos: Node.js 24 e o banco do Compose no ar (ele cria também o banco `diario_teste`, usado só pelos testes, que apagam dados da tabela `alunos`).

```bash
docker compose up -d db
cd backend
npm ci
set -a && . ../.env.example && set +a   # carrega DATABASE_URL e APP_DATABASE_URL
npm test
```

Também: `npm run build` (compila o TypeScript) em `backend` e em `frontend`. Na raiz, `npm test` e `npm run build` repetem esses comandos. O pipeline (`.github/workflows/ci.yml`, job `testes`) faz o mesmo a cada pull request e a cada push na `main`.

Os testes cobrem: a regra de domínio do aluno (unidade), o cadastro e a listagem pela API com PostgreSQL real (Supertest), a auditoria somente de inserção (ADR-003) e as regras de dependência da arquitetura (domínio sem express, knex, pg ou pdfmake; módulos só importam os permitidos).

## Estrutura de pastas

```
backend/
  src/
    modulos/            # um módulo por pasta, cada um com rotas, servicos, dominio e repositorio
      cadastro/         # implementado: alunos (H01, base)
      frequencia/  avaliacao/  alocacao/  historico-auditoria/  acesso/   # vazios por enquanto
      documentos/       # interface GeradorPdf (dominio) e adaptador do pdfmake (servicos), ainda vazio
    migrations/         # migrations do Knex (alunos; auditoria e usuário de banco sem UPDATE/DELETE)
    app.ts  servidor.ts  migrar.ts  config.ts
  tests/                # dominio, integracao, arquitetura
frontend/               # React + Vite (página única)
docs/adr/               # ADR-001 (tecnologia), ADR-002 (estilo), ADR-003 (auditoria)
docker/                 # script de criação do banco de testes
docker-compose.yml      # front-end, API e PostgreSQL
.github/workflows/      # pipeline de CI
```

Dependências permitidas entre módulos (sem ciclos): Documentos → Avaliação → Frequência → Histórico e auditoria → Cadastro → Acesso; Alocação → Cadastro. A lista completa está na seção 6 do documento de arquitetura.

## Stack

TypeScript, Node.js 24, Express 5, React 19 com Vite, PostgreSQL 18 com Knex e pg, pdfmake, Jest e Supertest, GitHub Actions. Versões fixadas nos `package.json`.
