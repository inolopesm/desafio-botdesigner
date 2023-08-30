export class Repository {
  constructor(private readonly fetcher: (url: string) => any) {}

  async findProcessosByDataBetween(dataInicial: Date, dataFinal: Date) {
    if (dataInicial.getTime() >= dataFinal.getTime()) {
      throw new Error("dataInicial must be before dataFinal");
    }

    const baseUrl = "https://compras.api.portaldecompraspublicas.com.br";
    const url = new URL("/v2/licitacao/processos", baseUrl);

    url.searchParams.set("pagina", "");
    url.searchParams.set("dataInicial", dataInicial.toISOString());
    url.searchParams.set("dataFinal", dataFinal.toISOString());
    url.searchParams.set("tipoData", "1");

    let i = 1;
    let max = 0;
    const result = [];

    do {
      url.searchParams.set("pagina", i.toString());
      const data = await this.fetcher(url.toString());

      if (max === 0) {
        max = data.pageCount;
      }

      result.push(...data.result);

      i = i + 1;
    } while (i <= max);

    return result;
  }
}
