import type { DocumentoPdf, GeradorPdf } from '../dominio/geradorPdf';

/**
 * Adaptador do pdfmake para a interface GeradorPdf.
 * Esqueleto da Etapa 2: ainda sem implementação. A geração real (boletim e
 * histórico, H05 e H07) entra na Etapa 3 e só este arquivo importará o pdfmake.
 */
export class GeradorPdfMake implements GeradorPdf {
  async gerar(_documento: DocumentoPdf): Promise<Buffer> {
    throw new Error('GeradorPdfMake ainda não implementado (Etapa 3).');
  }
}
