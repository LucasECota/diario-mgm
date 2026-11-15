import { Router } from 'express';
import type { AlunoServico } from '../servicos/alunoServico';

export function alunoRotas(servico: AlunoServico): Router {
  const rotas = Router();

  rotas.post('/', async (req, res) => {
    const aluno = await servico.cadastrar(req.body);
    res.status(201).json(aluno);
  });

  rotas.get('/', async (_req, res) => {
    res.json(await servico.listar());
  });

  return rotas;
}
