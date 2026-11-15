import knex from 'knex';
import { configMigracao } from './config';

async function main(): Promise<void> {
  const db = knex(configMigracao());
  try {
    const [lote, migracoes] = await db.migrate.latest();
    console.log(`Migrations aplicadas (lote ${lote}): ${migracoes.length}`);
  } finally {
    await db.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
