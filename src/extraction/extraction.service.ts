import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PortalDeComprasPublicasProvider } from "../portal-de-compras-publicas";
import { KnexProvider } from "../knex";
import { type Processo } from "./processo.entity";

@Injectable()
export class ExtractionService {
  private static formatDate(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}T03:00:00.000Z`;
  }

  private running = false;
  private readonly logger = new Logger(ExtractionService.name);

  constructor(
    private readonly portalDeComprasPublicas: PortalDeComprasPublicasProvider,
    private readonly knex: KnexProvider
  ) {}

  getRunning() {
    return this.running;
  }

  @Cron(CronExpression.EVERY_4_HOURS)
  async extract() {
    if (this.running) return;
    this.running = true;

    const actualDate = new Date();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const threeDaysAheadDate = new Date(actualDate.getTime() + threeDaysInMs);

    try {
      const results =
        await this.portalDeComprasPublicas.findProcessosByDataBetween(
          ExtractionService.formatDate(actualDate),
          ExtractionService.formatDate(threeDaysAheadDate)
        );

      const data = results.map<
        Omit<Processo, "id" | "criadoEm" | "atualizadoEm">
      >((result: any) => ({
        codigoLicitacao: result.codigoLicitacao,
        identificacao: result.identificacao,
        numero: result.numero,
        resumo: result.resumo,
        codigoSituacaoEdital: result.codigoSituacaoEdital,
        statusCodigo: result.status.codigo,
        dataHoraInicioLances: result.dataHoraInicioLances,
      }));

      await this.knex
        .client<Processo>("Processo")
        .insert(data)
        .onConflict("codigoLicitacao")
        .merge();
    } catch (error) {
      this.logger.error(String(error));
    } finally {
      this.running = false;
    }
  }
}
