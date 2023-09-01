import { Injectable } from "@nestjs/common";
import { request } from "undici";

@Injectable()
export class PortalDeComprasPublicasProvider {
  async findProcessosByDataBetween(dataInicial: string, dataFinal: string) {
    if (dataInicial >= dataFinal) {
      throw new Error("dataInicial must be before dataFinal");
    }

    const baseUrl = "https://compras.api.portaldecompraspublicas.com.br";
    const url = new URL("/v2/licitacao/processos", baseUrl);

    url.searchParams.set("pagina", "");
    url.searchParams.set("dataInicial", dataInicial);
    url.searchParams.set("dataFinal", dataFinal);
    url.searchParams.set("tipoData", "1");

    let i = 1;
    let max = 0;
    const result = [];

    do {
      url.searchParams.set("pagina", i.toString());
      const response = await request(url.toString());
      const data: any = await response.body.json();

      if (max === 0) {
        max = data.pageCount;
      }

      result.push(...data.result);

      i = i + 1;
    } while (i <= max);

    return result;
  }
}
