import { Test } from "@nestjs/testing";
import { AppService } from "./app.service";
import { PortalDeComprasPublicasProvider } from "./portal-de-compras-publicas";
import { KnexProvider } from "./knex/knex.provider";

const sleep = async (ms: number) => {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
};

const processo1 = {
  id: 1,
  codigoLicitacao: 251694,
  identificacao: "PROC. ADMINISTRATIVO Nº 061/2023/CPL",
  numero: "P.E 033/2023-SRP",
  resumo: "Sistema de Registro de Preços para a Contratação de empresa espe...",
  codigoSituacaoEdital: 5,
  status: { codigo: 1 },
  dataHoraInicioLances: new Date(2023, 9 - 1, 1, 18, 0, 0),
  criadoEm: new Date(2023, 9 - 1, 1, 0, 19, 50, 25911),
  atualizadoEm: new Date(2023, 9 - 1, 1, 0, 19, 50, 25911),
};

const processo2 = {
  id: 2,
  codigoLicitacao: 250767,
  identificacao: "20/2023",
  numero: "06/2023 - FMS",
  resumo: "REGISTRO DE PREÇOS PARA FUTURA E EVENTUAL AQUISIÇÃO DE UNIFORMES...",
  codigoSituacaoEdital: 5,
  status: { codigo: 1 },
  dataHoraInicioLances: new Date(2023, 9 - 1, 1, 17, 30, 0),
  criadoEm: new Date(2023, 9 - 1, 1, 0, 19, 50, 25911),
  atualizadoEm: new Date(2023, 9 - 1, 1, 0, 23, 23, 78882),
};

describe("AppService", () => {
  let service: AppService;
  let portalDeComprasPublicas: PortalDeComprasPublicasProvider;

  let mockedKnex: {
    client: jest.Mock<any, any, any>;
    insert: jest.Mock<any, any, any>;
    onConflict: jest.Mock<any, any, any>;
    merge: jest.Mock<Promise<void>, [], any>;
  };

  const findResult = [processo1, processo2];

  beforeEach(async () => {
    mockedKnex = {
      client: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      onConflict: jest.fn().mockReturnThis(),
      merge: jest.fn(async () => {}),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: PortalDeComprasPublicasProvider,
          useFactory: () => ({
            findProcessosByDataBetween: jest.fn().mockResolvedValue(findResult),
          }),
        },
        {
          provide: KnexProvider,
          useValue: {
            client: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            onConflict: jest.fn().mockReturnThis(),
            merge: jest.fn(async () => {}),
          },
        },
        AppService,
      ],
    }).compile();

    service = moduleRef.get(AppService);
    portalDeComprasPublicas = moduleRef.get(PortalDeComprasPublicasProvider);
    mockedKnex = moduleRef.get(KnexProvider);
  });

  describe("extract", () => {
    it("should early return if method is already running", async () => {
      jest
        .spyOn(portalDeComprasPublicas, "findProcessosByDataBetween")
        .mockImplementationOnce(async () => {
          await sleep(250);
          return [processo1, processo2];
        });

      void service.extract();
      void service.extract();

      expect(
        portalDeComprasPublicas.findProcessosByDataBetween
      ).toHaveBeenCalledTimes(1);
    });

    it("should find processos by data between actual date and thre days ahead", async () => {
      jest.useFakeTimers({ now: new Date(2023, 9 - 1, 1, 22, 3) });

      await service.extract();

      expect(
        portalDeComprasPublicas.findProcessosByDataBetween
      ).toHaveBeenCalledTimes(1);

      expect(
        portalDeComprasPublicas.findProcessosByDataBetween
      ).toHaveBeenCalledWith(
        "2023-09-01T03:00:00.000Z",
        "2023-09-04T03:00:00.000Z"
      );

      jest.useRealTimers();
    });

    it("should upsert received processos on database", async () => {
      await service.extract();

      const data = findResult.map((result) => ({
        codigoLicitacao: result.codigoLicitacao,
        identificacao: result.identificacao,
        numero: result.numero,
        resumo: result.resumo,
        codigoSituacaoEdital: result.codigoSituacaoEdital,
        statusCodigo: result.status.codigo,
        dataHoraInicioLances: result.dataHoraInicioLances,
      }));

      expect(mockedKnex.client).toHaveBeenCalledTimes(1);
      expect(mockedKnex.client).toHaveBeenCalledWith("Processo");
      expect(mockedKnex.insert).toHaveBeenCalledTimes(1);
      expect(mockedKnex.insert).toHaveBeenCalledWith(data);
      expect(mockedKnex.onConflict).toHaveBeenCalledTimes(1);
      expect(mockedKnex.onConflict).toHaveBeenCalledWith("codigoLicitacao");
      expect(mockedKnex.merge).toHaveBeenCalledTimes(1);
    });
  });
});
