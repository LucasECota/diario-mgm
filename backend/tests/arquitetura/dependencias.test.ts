import fs from 'node:fs';
import path from 'node:path';

const RAIZ_MODULOS = path.resolve(__dirname, '../../src/modulos');

// Coluna "Depende de" da tabela de módulos (seção 6 do documento de arquitetura).
// "A depende de B" = A pode importar B. O grafo é acíclico por construção.
const PERMITIDAS: Record<string, string[]> = {
  documentos: ['avaliacao', 'frequencia', 'historico-auditoria', 'cadastro'],
  avaliacao: ['cadastro', 'frequencia', 'historico-auditoria', 'acesso'],
  frequencia: ['cadastro', 'historico-auditoria', 'acesso'],
  'historico-auditoria': ['cadastro'],
  cadastro: ['acesso'],
  acesso: [],
  alocacao: ['cadastro', 'acesso'],
};

function arquivosTs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const caminho = path.join(dir, e.name);
    return e.isDirectory() ? arquivosTs(caminho) : caminho.endsWith('.ts') ? [caminho] : [];
  });
}

function importacoes(arquivo: string): string[] {
  const texto = fs.readFileSync(arquivo, 'utf8');
  const achados = [...texto.matchAll(/(?:from|import|require\()\s*['"]([^'"]+)['"]/g)];
  return achados.map((m) => m[1]);
}

describe('regras de dependência da arquitetura', () => {
  it('arquivos de domínio não importam express, knex, pg nem pdfmake', () => {
    const proibidos = /^(express|knex|pg|pdfmake)(\/|$)/;
    const violacoes: string[] = [];
    for (const modulo of Object.keys(PERMITIDAS)) {
      for (const arq of arquivosTs(path.join(RAIZ_MODULOS, modulo, 'dominio'))) {
        for (const imp of importacoes(arq)) {
          if (proibidos.test(imp)) violacoes.push(`${path.relative(RAIZ_MODULOS, arq)} importa ${imp}`);
        }
      }
    }
    expect(violacoes).toEqual([]);
  });

  it('módulos só importam os módulos permitidos (sem ciclos)', () => {
    const violacoes: string[] = [];
    for (const [modulo, permitidos] of Object.entries(PERMITIDAS)) {
      for (const arq of arquivosTs(path.join(RAIZ_MODULOS, modulo))) {
        for (const imp of importacoes(arq)) {
          if (!imp.startsWith('.')) continue;
          const alvo = path.resolve(path.dirname(arq), imp);
          const rel = path.relative(RAIZ_MODULOS, alvo);
          if (rel.startsWith('..')) continue;
          const outro = rel.split(path.sep)[0];
          if (outro !== modulo && !permitidos.includes(outro)) {
            violacoes.push(`${modulo} não pode importar ${outro} (${path.relative(RAIZ_MODULOS, arq)})`);
          }
        }
      }
    }
    expect(violacoes).toEqual([]);
  });
});
