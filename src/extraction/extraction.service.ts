import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PortalDeComprasPublicasProvider } from "../portal-de-compras-publicas";
import { KnexProvider } from "../knex";
import { type Processo } from "./processo.entity";
import { type ProcessoItem } from "./processo-item.entity";

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
      const processosResults =
        await this.portalDeComprasPublicas.findProcessosByDataBetween(
          ExtractionService.formatDate(actualDate),
          ExtractionService.formatDate(threeDaysAheadDate)
        );

      const processosData = processosResults.map<
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

      const processosInserted = await this.knex
        .client<Processo>("Processo")
        .insert(processosData)
        .onConflict("codigoLicitacao")
        .merge()
        .returning(["codigoLicitacao", "id"]);

      const itemsData = (
        await Promise.all(
          processosInserted.map(async (processo) => {
            const itemsResults =
              await this.portalDeComprasPublicas.findItemsByCodigoLicitacao(
                processo.codigoLicitacao
              );

            return itemsResults.map<
              Omit<ProcessoItem, "id" | "criadoEm" | "atualizadoEm">
            >((result: any, i) => ({
              processoId: processo.id,
              indice: i,
              quantidade: result.quantidade,
              valorReferencia: result.valorReferencia,
              descricao: result.descricao,
              participacaoCodigo: result.participacao.codigo,
              codigo: result.codigo,
            }));
          })
        )
      ).flat();

      // for (const itemData of itemsData) {
      //   console.log(itemData);
      //   await this.knex
      //     .client<ProcessoItem>("ProcessoItem")
      //     .insert(itemData)
      //     .onConflict(["processoId", "indice"])
      //     .merge();
      // }

      await this.knex
        .client<ProcessoItem>("ProcessoItem")
        .insert(itemsData)
        .onConflict(["processoId", "indice"])
        .merge();
    } catch (error) {
      this.logger.error(String(error));
    } finally {
      this.running = false;
    }
  }
}
