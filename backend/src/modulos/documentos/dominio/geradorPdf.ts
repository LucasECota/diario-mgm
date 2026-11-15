// Porta do padrão Adapter (seção 7 do documento de arquitetura).
// O domínio conhece só esta interface; a biblioteca de PDF fica atrás de um adaptador.

export interface DocumentoPdf {
  titulo: string;
  linhas: string[][];
}

export interface GeradorPdf {
  gerar(documento: DocumentoPdf): Promise<Buffer>;
}
