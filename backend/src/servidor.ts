import knex from 'knex';
import { criarApp } from './app';
import { configAplicacao } from './config';

const porta = Number(process.env.PORT ?? 3000);
const db = knex(configAplicacao());

criarApp(db).listen(porta, () => {
  console.log(`API do DiárioMGM ouvindo na porta ${porta}`);
});
