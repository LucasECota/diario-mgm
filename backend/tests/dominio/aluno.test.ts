import { ErroValidacao, TAMANHO_MAXIMO_NOME, validarNovoAluno } from '../../src/modulos/cadastro/dominio/aluno';

describe('validarNovoAluno (regra de domínio do Cadastro)', () => {
  it('aceita um nome válido', () => {
    expect(validarNovoAluno({ nome: 'Aluno Ficticio Um' })).toEqual({ nome: 'Aluno Ficticio Um' });
  });

  it('remove espaços nas pontas e repetidos', () => {
    expect(validarNovoAluno({ nome: '  Aluno   Ficticio  Dois ' }).nome).toBe('Aluno Ficticio Dois');
  });

  it.each([[{}], [{ nome: '' }], [{ nome: '   ' }], [{ nome: 42 }], [null], ['texto']])(
    'rejeita entrada sem nome válido: %j',
    (entrada) => {
      expect(() => validarNovoAluno(entrada)).toThrow(ErroValidacao);
    },
  );

  it('rejeita nome acima do tamanho máximo', () => {
    expect(() => validarNovoAluno({ nome: 'a'.repeat(TAMANHO_MAXIMO_NOME + 1) })).toThrow(ErroValidacao);
  });
});
