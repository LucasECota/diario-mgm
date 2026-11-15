import { useEffect, useState, type FormEvent } from 'react';
import { cadastrarAluno, listarAlunos, type Aluno } from './api';

export function App() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    try {
      setAlunos(await listarAlunos());
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  useEffect(() => {
    void carregar();
  }, []);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    try {
      await cadastrarAluno(nome);
      setNome('');
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  return (
    <main>
      <h1>DiárioMGM</h1>
      <h2>Alunos</h2>

      <form onSubmit={enviar}>
        <label htmlFor="nome">Nome do aluno</label>
        <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Use apenas nomes fictícios" />
        <button type="submit">Cadastrar</button>
      </form>

      {erro && <p role="alert" className="erro">{erro}</p>}

      <ul aria-label="Lista de alunos">
        {alunos.map((a) => (
          <li key={a.id}>{a.nome}</li>
        ))}
      </ul>
      {alunos.length === 0 && !erro && <p>Nenhum aluno cadastrado.</p>}
    </main>
  );
}
