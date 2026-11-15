export interface Aluno {
  id: number;
  nome: string;
  criadoEm: string;
}

async function lerResposta<T>(resposta: Response): Promise<T> {
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error((corpo as { erro?: string }).erro ?? `Falha na requisição (${resposta.status}).`);
  }
  return corpo as T;
}

export async function listarAlunos(): Promise<Aluno[]> {
  return lerResposta<Aluno[]>(await fetch('/api/alunos'));
}

export async function cadastrarAluno(nome: string): Promise<Aluno> {
  return lerResposta<Aluno>(
    await fetch('/api/alunos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome }),
    }),
  );
}
