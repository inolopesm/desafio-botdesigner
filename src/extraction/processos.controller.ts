/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Controller, Get, Query } from "@nestjs/common";
import { KnexProvider } from "../knex";
import { FindProcessosDto } from "./find-processos.dto";

@Controller({ version: "1" })
export class ProcessosController {
  constructor(private readonly knex: KnexProvider) {}

  @Get("processos")
  async find(@Query() findProcessosDto: FindProcessosDto) {
    let query = this.knex
      .client("Processo")
      .select([
        "Processo.id",
        "Processo.codigoLicitacao",
        "Processo.identificacao",
        "Processo.resumo",
        "Processo.codigoSituacaoEdital",
        "Processo.statusCodigo",
        "Processo.dataHoraInicioLances",
        "Processo.criadoEm",
        "Processo.atualizadoEm",
        this.knex.client.raw(`
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', "ProcessoItem"."id",
                'processoId', "ProcessoItem"."processoId",
                'indice', "ProcessoItem"."indice",
                'quantidade', "ProcessoItem"."quantidade",
                'valorReferencia', "ProcessoItem"."valorReferencia",
                'descricao', "ProcessoItem"."descricao",
                'participacaoCodigo', "ProcessoItem"."participacaoCodigo",
                'codigo', "ProcessoItem"."codigo",
                'criadoEm', "ProcessoItem"."criadoEm",
                'atualizadoEm', "ProcessoItem"."atualizadoEm"
              )
            ) FILTER (WHERE "ProcessoItem"."id" IS NOT NULL),
            '[]'::JSON
          )
        `),
      ])
      .join("ProcessoItem", "Processo.id", "ProcessoItem.processoId")
      .groupBy("Processo.id")
      .orderBy("Processo.id");

    let hasWhere = false;

    if (findProcessosDto.dataInicio) {
      query = query.where(
        "Processo.dataHoraInicioLances",
        ">=",
        new Date(findProcessosDto.dataInicio)
      );

      hasWhere = true;
    }

    if (findProcessosDto.numero) {
      query = query[hasWhere ? "andWhere" : "where"](
        "Processo.numero",
        findProcessosDto.numero
      );

      if (!hasWhere) hasWhere = true;
    }

    if (findProcessosDto.resumo) {
      query = query[hasWhere ? "andWhereILike" : "whereILike"](
        "Processo.resumo",
        `%${findProcessosDto.resumo}%`
      );

      if (!hasWhere) hasWhere = true;
    }

    if (findProcessosDto.itemDescricao) {
      query = query[hasWhere ? "andWhereILike" : "whereILike"](
        "ProcessoItem.descricao",
        `%${findProcessosDto.itemDescricao}%`
      );

      if (!hasWhere) hasWhere = true;
    }

    return await query;
  }
}
