import { Injectable } from "@nestjs/common";
import { HttpClient } from "./http.client";
import { Time } from "./time.util";

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
      const { data } = await HttpClient.request(url.toString());

      if (max === 0) {
        max = data.pageCount;
      }

      result.push(...data.result);

      i = i + 1;
      await Time.sleep(500);
    } while (i <= max);

    return result;
  }

  async findItemsByCodigoLicitacao(codigoLicitacao: number): Promise<any[]> {
    const baseUrl = "https://compras.api.portaldecompraspublicas.com.br";
    const url = new URL(`/v2/licitacao/${codigoLicitacao}/itens`, baseUrl);

    url.searchParams.set("filtro", "");
    url.searchParams.set("pagina", "1");

    let i = 1;
    let max = 0;
    const result = [];

    do {
      url.searchParams.set("pagina", i.toString());
      const { data } = await HttpClient.request(url.toString());

      if (data.isLote === true) return [];
      if (max === 0) max = data.itens.pageCount;

      result.push(...data.itens.result);

      i = i + 1;

      await Time.sleep(500);
    } while (i <= max);

    return result;
  }
}
