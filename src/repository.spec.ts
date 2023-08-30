import { Repository } from "./repository";

describe(Repository.name, () => {
  describe(Repository.prototype.findProcessosByDataBetween.name, () => {
    it("dataInicial must be before dataFinal", async () => {
      const fetcher = jest.fn().mockResolvedValue({ pageCount: 1, result: [] });
      const repository = new Repository(fetcher);
      const inicial = new Date(2023, 9 - 1, 3);
      const final = new Date(2023, 9 - 1, 1);
      const promise = repository.findProcessosByDataBetween(inicial, final);
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
        new Date(2023, 9 - 1, 1),
        new Date(2023, 9 - 1, 3)
      );

      expect(result).toEqual([
        "https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?pagina=1&dataInicial=2023-09-01T03%3A00%3A00.000Z&dataFinal=2023-09-03T03%3A00%3A00.000Z&tipoData=1",
        "https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?pagina=2&dataInicial=2023-09-01T03%3A00%3A00.000Z&dataFinal=2023-09-03T03%3A00%3A00.000Z&tipoData=1",
        "https://compras.api.portaldecompraspublicas.com.br/v2/licitacao/processos?pagina=3&dataInicial=2023-09-01T03%3A00%3A00.000Z&dataFinal=2023-09-03T03%3A00%3A00.000Z&tipoData=1",
      ]);
    });
  });
});
