import request from 'supertest';
import type { Knex } from 'knex';
import { criarApp } from '../../src/app';
import { conexaoApp, prepararBanco } from './ambiente';

describe('API /alunos (integração: rota, serviço, repositório e PostgreSQL)', () => {
  let dono: Knex;
  let app: Knex;

  beforeAll(async () => {
    dono = await prepararBanco();
    app = conexaoApp();
  });

  beforeEach(async () => {
    await dono('alunos').del();
  });

  afterAll(async () => {
    await app.destroy();
    await dono.destroy();
  });

  it('cadastra um aluno fictício e o lista', async () => {
    const api = criarApp(app);

    const criado = await request(api).post('/alunos').send({ nome: 'Aluno Ficticio Teste' });
    expect(criado.status).toBe(201);
    expect(criado.body).toMatchObject({ nome: 'Aluno Ficticio Teste' });
    expect(typeof criado.body.id).toBe('number');

    const lista = await request(api).get('/alunos');
    expect(lista.status).toBe(200);
    expect(lista.body).toHaveLength(1);
    expect(lista.body[0]).toMatchObject({ id: criado.body.id, nome: 'Aluno Ficticio Teste' });
  });

  it('responde 400 para nome vazio e não grava nada', async () => {
    const api = criarApp(app);

    const resposta = await request(api).post('/alunos').send({ nome: '  ' });
    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toMatch(/obrigatório/);

    expect((await request(api).get('/alunos')).body).toEqual([]);
  });

  it('responde 400 para JSON malformado', async () => {
    const resposta = await request(criarApp(app)).post('/alunos').set('Content-Type', 'application/json').send('{ruim');
    expect(resposta.status).toBe(400);
  });

  it('responde ok em /saude', async () => {
    const resposta = await request(criarApp(app)).get('/saude');
    expect(resposta.body).toEqual({ status: 'ok' });
  });
});
