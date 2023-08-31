import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PortalDeComprasPublicasProvider } from "./portal-de-compras-publicas.provider";

@Injectable()
export class AppService {
  constructor(private readonly provider: PortalDeComprasPublicasProvider) {}

  private static formatDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}T03:00:00.000Z`;
  }

  @Cron(CronExpression.EVERY_4_HOURS)
  async extract() {
    const actualDate = new Date();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const threeDaysAheadDate = new Date(actualDate.getTime() + threeDaysInMs);

    await this.provider.findProcessosByDataBetween(
      AppService.formatDate(actualDate),
      AppService.formatDate(threeDaysAheadDate)
    );
  }
}
