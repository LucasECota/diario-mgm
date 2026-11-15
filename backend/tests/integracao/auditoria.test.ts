import type { Knex } from 'knex';
import { conexaoApp, prepararBanco } from './ambiente';

// ADR-003: o usuário da aplicação só insere e lê na auditoria.
const temUsuarioApp = Boolean(process.env.APP_DATABASE_URL);

(temUsuarioApp ? describe : describe.skip)('auditoria somente de inserção (ADR-003)', () => {
  let dono: Knex;
  let app: Knex;

  beforeAll(async () => {
    dono = await prepararBanco();
    app = conexaoApp();
  });

  afterAll(async () => {
    await app.destroy();
    await dono.destroy();
  });

  it('o usuário da aplicação consegue inserir, mas não alterar nem apagar', async () => {
    const [linha] = await app('auditoria')
      .insert({ tabela: 'alunos', registro_id: '1', campo: 'nome', valor_novo: 'x', autor: 'teste' })
      .returning('id');

    await expect(app('auditoria').where({ id: linha.id }).update({ valor_novo: 'y' })).rejects.toThrow(/permission denied/);
    await expect(app('auditoria').where({ id: linha.id }).del()).rejects.toThrow(/permission denied/);
  });
});
