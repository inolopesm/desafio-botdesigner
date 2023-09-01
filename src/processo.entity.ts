export interface Processo {
  id: number;
  codigoLicitacao: number;
  identificacao: string;
  numero: string;
  resumo: string;
  codigoSituacaoEdital: number;
  statusCodigo: number;
  dataHoraInicioLances: Date;
  criadoEm: Date;
  atualizadoEm: Date;
}
