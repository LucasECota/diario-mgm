import type { Knex } from 'knex';
import path from 'node:path';

const extensao = path.extname(__filename); // '.ts' sob Jest, '.js' após o build

/** Conexão do dono do esquema (migrations). */
export function configMigracao(): Knex.Config {
  return {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, 'migrations'),
      loadExtensions: [extensao],
    },
  };
}

/** Conexão da aplicação: usa o usuário sem UPDATE/DELETE na auditoria (ADR-003), se configurado. */
export function configAplicacao(): Knex.Config {
  return {
    client: 'pg',
    connection: process.env.APP_DATABASE_URL ?? process.env.DATABASE_URL,
    pool: { min: 0, max: 10 },
  };
}
