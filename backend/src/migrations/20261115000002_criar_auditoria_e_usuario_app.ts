import type { Knex } from 'knex';

// ADR-003: tabela de auditoria somente de inserção. O usuário de banco da
// aplicação recebe apenas SELECT e INSERT nela (nunca UPDATE nem DELETE).
// Neste esqueleto a tabela existe, mas nenhuma regra grava nela ainda.

const USUARIO_APP = 'diario_app';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('auditoria', (t) => {
    t.bigIncrements('id').primary();
    t.string('tabela', 100).notNullable();
    t.string('registro_id', 100).notNullable();
    t.string('campo', 100).notNullable();
    t.text('valor_anterior');
    t.text('valor_novo');
    t.string('autor', 200).notNullable();
    t.text('justificativa');
    t.timestamp('criado_em', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(['tabela', 'registro_id']);
  });

  const senha = (process.env.APP_DB_PASSWORD ?? 'diario_app_dev').replace(/'/g, "''");
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${USUARIO_APP}') THEN
        CREATE ROLE ${USUARIO_APP} LOGIN PASSWORD '${senha}';
      ELSE
        ALTER ROLE ${USUARIO_APP} LOGIN PASSWORD '${senha}';
      END IF;
    END $$;
  `);
  await knex.raw(`GRANT USAGE ON SCHEMA public TO ${USUARIO_APP}`);
  await knex.raw(`GRANT SELECT, INSERT ON alunos, auditoria TO ${USUARIO_APP}`);
  await knex.raw(`GRANT USAGE, SELECT ON SEQUENCE alunos_id_seq, auditoria_id_seq TO ${USUARIO_APP}`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`REVOKE ALL ON alunos FROM ${USUARIO_APP}`);
  await knex.schema.dropTable('auditoria');
  // O papel de banco é mantido de propósito: papéis são do cluster, não do banco.
}
