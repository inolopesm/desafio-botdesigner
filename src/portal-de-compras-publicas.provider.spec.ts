import { Test } from "@nestjs/testing";
import { PortalDeComprasPublicasProvider } from "./portal-de-compras-publicas.provider";

jest.mock("undici", () => ({
  request: async (url: string) => ({
    body: {
      json: async () => ({ pageCount: 3, result: [url] }),
    },
  }),
}));

describe("PortalDeComprasPublicasProvider", () => {
  let provider: PortalDeComprasPublicasProvider;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PortalDeComprasPublicasProvider],
    }).compile();

    provider = moduleRef.get(PortalDeComprasPublicasProvider);
  });

  describe("findProcessosByDataBetween", () => {
    it("dataInicial must be before dataFinal", async () => {
      const promise = provider.findProcessosByDataBetween(
        "2023-09-03T03:00:00.000Z",
        "2023-09-01T03:00:00.000Z"
      );

      const error = new Error("dataInicial must be before dataFinal");
      await expect(promise).rejects.toThrow(error);
    });

    it("should retrieve all pages of results when success", async () => {
      const result = await provider.findProcessosByDataBetween(
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
