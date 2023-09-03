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
      await this.knex.client.transaction(async (trx) => {
        const processoResults =
          await this.portalDeComprasPublicas.findProcessosByDataBetween(
            ExtractionService.formatDate(actualDate),
            ExtractionService.formatDate(threeDaysAheadDate)
          );

        for (const processoResult of processoResults) {
          const processoData: Omit<
            Processo,
            "id" | "criadoEm" | "atualizadoEm"
          > = {
            codigoLicitacao: processoResult.codigoLicitacao,
            identificacao: processoResult.identificacao,
            numero: processoResult.numero,
            resumo: processoResult.resumo,
            codigoSituacaoEdital: processoResult.codigoSituacaoEdital,
            statusCodigo: processoResult.status.codigo,
            dataHoraInicioLances: processoResult.dataHoraInicioLances,
          };

          console.log(JSON.stringify(processoData));

          const processoInserteds = await trx<Processo>("Processo")
            .insert(processoData)
            .onConflict("codigoLicitacao")
            .merge()
            .returning(["codigoLicitacao", "id"]);

          for (const processoInserted of processoInserteds) {
            const itemsResults =
              await this.portalDeComprasPublicas.findItemsByCodigoLicitacao(
                processoInserted.codigoLicitacao
              );

            const mapIndex = <T>(v: T, i: number) => [v, i] as const;

            for (const [itemResult, i] of itemsResults.map(mapIndex)) {
              const itemData: Omit<
                ProcessoItem,
                "id" | "criadoEm" | "atualizadoEm"
              > = {
                processoId: processoInserted.id,
                indice: i,
                quantidade: itemResult.quantidade,
                valorReferencia: itemResult.valorReferencia,
                descricao: itemResult.descricao,
                participacaoCodigo: itemResult.participacao.codigo,
                codigo: itemResult.codigo,
              };

              console.log(JSON.stringify(itemData));

              await trx<ProcessoItem>("ProcessoItem")
                .insert(itemData)
                .onConflict(["processoId", "indice"])
                .merge();
            }
          }
        }
      });
    } catch (error) {
      this.logger.error(String(error));
    } finally {
      this.running = false;
    }
  }
}
