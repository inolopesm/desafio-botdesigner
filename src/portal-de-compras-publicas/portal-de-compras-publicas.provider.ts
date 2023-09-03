import { Injectable } from "@nestjs/common";
import { request, errors, type Dispatcher } from "undici";
import { Time } from "../time.util";

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
    let tries = 0;

    do {
      url.searchParams.set("pagina", i.toString());

      let response: Dispatcher.ResponseData;

      try {
        response = await request(url.toString());
      } catch (error) {
        if (error.code instanceof errors.ConnectTimeoutError) {
          if (tries === 3) throw new Error("max tries reached");
          tries += 1;
          await Time.sleep(500);
          continue;
        }

        throw error;
      }

      const contentType = response.headers["content-type"];

      if (contentType === undefined) {
        if (tries === 3) throw new Error("max tries reached");
        tries += 1;
        await Time.sleep(500);
        continue;
      }

      if (typeof contentType !== "string") {
        if (tries === 3) throw new Error("max tries reached");
        tries += 1;
        await Time.sleep(500);
        continue;
      }

      if (!contentType.includes("json")) {
        if (tries === 3) throw new Error("max tries reached");
        tries += 1;
        await Time.sleep(500);
        continue;
      }
      const data: any = await response.body.json();

      if (data.pageCount === undefined) {
        if (tries === 3) throw new Error("max tries reached");
        tries += 1;
        await Time.sleep(500);
        continue;
      }

      if (max === 0) {
        max = data.pageCount;
      }

      result.push(...data.result);

      tries = 0;
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
    let tries = 0;

    do {
      url.searchParams.set("pagina", i.toString());
      let response: Dispatcher.ResponseData;

      try {
        response = await request(url.toString());
      } catch (error) {
        if (error.code instanceof errors.ConnectTimeoutError) {
          if (tries === 3) throw new Error("max tries reached");
          tries += 1;
          await Time.sleep(500);
          continue;
        }

        throw error;
      }

      const contentType = response.headers["content-type"];

      if (contentType === undefined) {
        if (tries === 3) throw new Error("max tries reached");
        tries += 1;
        await Time.sleep(500);
        continue;
      }

      if (typeof contentType !== "string") {
        if (tries === 3) throw new Error("max tries reached");
        tries += 1;
        await Time.sleep(500);
        continue;
      }

      if (!contentType.includes("json")) {
        if (tries === 3) throw new Error("max tries reached");
        tries += 1;
        await Time.sleep(500);
        continue;
      }

      const data: any = await response.body.json();

      if (data.isLote === true) {
        return [];
      }

      if (data.itens === undefined) {
        if (tries === 3) throw new Error("max tries reached");
        tries += 1;
        await Time.sleep(500);
        continue;
      }

      if (max === 0) {
        max = data.itens.pageCount;
      }

      result.push(...data.itens.result);

      tries = 0;
      i = i + 1;
      await Time.sleep(500);
    } while (i <= max);

    return result;
  }
}
