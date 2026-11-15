// Regra de domínio do módulo Cadastro. Não pode importar express, knex, pg ou pdfmake.

export const TAMANHO_MAXIMO_NOME = 200;

export interface Aluno {
  id: number;
  nome: string;
  criadoEm: Date;
}

export interface NovoAluno {
  nome: string;
}

export class ErroValidacao extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'ErroValidacao';
  }
}

/** Valida e normaliza os dados de um novo aluno (H01, base). */
export function validarNovoAluno(entrada: unknown): NovoAluno {
  if (typeof entrada !== 'object' || entrada === null) {
    throw new ErroValidacao('Dados do aluno inválidos.');
  }
  const bruto = (entrada as { nome?: unknown }).nome;
  if (typeof bruto !== 'string') {
    throw new ErroValidacao('O nome do aluno é obrigatório.');
  }
  const nome = bruto.trim().replace(/\s+/g, ' ');
  if (nome.length === 0) {
    throw new ErroValidacao('O nome do aluno é obrigatório.');
  }
  if (nome.length > TAMANHO_MAXIMO_NOME) {
    throw new ErroValidacao(`O nome do aluno deve ter no máximo ${TAMANHO_MAXIMO_NOME} caracteres.`);
  }
  return { nome };
}
