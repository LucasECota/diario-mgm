import knex, { type Knex } from 'knex';
import { configAplicacao, configMigracao } from '../../src/config';

if (!process.env.DATABASE_URL) {
  throw new Error('Defina DATABASE_URL (veja .env.example) para rodar os testes de integração.');
}

/** Aplica as migrations com o dono do esquema e devolve a conexão do dono. */
export async function prepararBanco(): Promise<Knex> {
  const dono = knex(configMigracao());
  await dono.migrate.latest();
  return dono;
}

/** Conexão da aplicação (usuário sem UPDATE/DELETE na auditoria, se APP_DATABASE_URL existir). */
export function conexaoApp(): Knex {
  return knex(configAplicacao());
}
