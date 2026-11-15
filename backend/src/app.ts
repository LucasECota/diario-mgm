import express, { type ErrorRequestHandler } from 'express';
import type { Knex } from 'knex';
import { ErroValidacao } from './modulos/cadastro/dominio/aluno';
import { AlunoRepositorio } from './modulos/cadastro/repositorio/alunoRepositorio';
import { AlunoServico } from './modulos/cadastro/servicos/alunoServico';
import { alunoRotas } from './modulos/cadastro/rotas/alunoRotas';

const tratarErros: ErrorRequestHandler = (erro, _req, res, _next) => {
  if (erro instanceof ErroValidacao) {
    res.status(400).json({ erro: erro.message });
    return;
  }
  if (erro?.type === 'entity.parse.failed') {
    res.status(400).json({ erro: 'JSON inválido.' });
    return;
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno.' });
};

export function criarApp(db: Knex): express.Express {
  const app = express();
  app.use(express.json());

  app.get('/saude', (_req, res) => {
    res.json({ status: 'ok' });
  });

  const alunoServico = new AlunoServico(new AlunoRepositorio(db));
  app.use('/alunos', alunoRotas(alunoServico));

  app.use(tratarErros);
  return app;
}
