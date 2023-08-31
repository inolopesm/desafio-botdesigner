import { Repository } from "./repository";

describe(Repository.name, () => {
  describe(Repository.prototype.findProcessosByDataBetween.name, () => {
    it("dataInicial must be before dataFinal", async () => {
      const repository = new Repository(() => null);

      const promise = repository.findProcessosByDataBetween(
        "2023-09-03T03:00:00.000Z",
        "2023-09-01T03:00:00.000Z"
      );

      const error = new Error("dataInicial must be before dataFinal");
      await expect(promise).rejects.toThrow(error);
    });

    it("should retrieve all pages of results when success", async () => {
      const fetcher = jest.fn(async (url: string) => ({
        pageCount: 3,
        result: [url],
      }));

      const repository = new Repository(fetcher);

      const result = await repository.findProcessosByDataBetween(
        "2023-09-01T03:00:00.000Z",
        "2023-09-03T03:00:00.000Z"
      );

      expect(result).toEqual([
        "https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?pagina=1&dataInicial=2023-09-01T03%3A00%3A00.000Z&dataFinal=2023-09-03T03%3A00%3A00.000Z&tipoData=1",
        "https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?pagina=2&dataInicial=2023-09-01T03%3A00%3A00.000Z&dataFinal=2023-09-03T03%3A00%3A00.000Z&tipoData=1",
        "https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?pagina=3&dataInicial=2023-09-01T03%3A00%3A00.000Z&dataFinal=2023-09-03T03%3A00%3A00.000Z&tipoData=1",
      ]);
    });
  });
});
