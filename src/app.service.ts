import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PortalDeComprasPublicasProvider } from "./portal-de-compras-publicas.provider";
import { KnexProvider } from "./knex.provider";
import { type Processo } from "./processo.entity";

@Injectable()
export class AppService {
  private static formatDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}T03:00:00.000Z`;
  }

  private running = false;

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
          AppService.formatDate(actualDate),
          AppService.formatDate(threeDaysAheadDate)
        );

      const data = results.map<
        Omit<Processo, "id" | "criadoEm" | "atualizadoEm">
      >((result) => ({
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
    } finally {
      this.running = false;
    }
  }
}
