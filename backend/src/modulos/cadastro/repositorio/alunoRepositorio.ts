import type { Knex } from 'knex';
import type { Aluno, NovoAluno } from '../dominio/aluno';

interface LinhaAluno {
  id: number;
  nome: string;
  criado_em: Date;
}

const paraAluno = (l: LinhaAluno): Aluno => ({ id: l.id, nome: l.nome, criadoEm: l.criado_em });

/** Único ponto do módulo Cadastro que fala com o banco. */
export class AlunoRepositorio {
  constructor(private readonly db: Knex) {}

  async inserir(novo: NovoAluno): Promise<Aluno> {
    const [linha] = await this.db<LinhaAluno>('alunos').insert({ nome: novo.nome }).returning('*');
    return paraAluno(linha);
  }

  async listar(): Promise<Aluno[]> {
    const linhas = await this.db<LinhaAluno>('alunos').select('*').orderBy('nome').orderBy('id');
    return linhas.map(paraAluno);
  }
}
