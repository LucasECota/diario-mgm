import { validarNovoAluno, type Aluno } from '../dominio/aluno';
import type { AlunoRepositorio } from '../repositorio/alunoRepositorio';

/** Serviço de aplicação: orquestra domínio e repositório. */
export class AlunoServico {
  constructor(private readonly repositorio: AlunoRepositorio) {}

  cadastrar(entrada: unknown): Promise<Aluno> {
    return this.repositorio.inserir(validarNovoAluno(entrada));
  }

  listar(): Promise<Aluno[]> {
    return this.repositorio.listar();
  }
}
