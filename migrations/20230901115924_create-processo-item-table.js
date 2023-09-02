/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE "ProcessoItem" (
      "id" SERIAL8 NOT NULL,
      "processoId" BIGINT NOT NULL,
      "indice" SMALLINT NOT NULL,
      "quantidade" DECIMAL(9, 2) NOT NULL,
      "valorReferencia" DECIMAL(9, 2) NOT NULL,
      "descricao" TEXT NOT NULL,
      "participacaoCodigo" SMALLINT NOT NULL,
      "codigo" INT NOT NULL,
      "criadoEm" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "atualizadoEm" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY ("id"),
      FOREIGN KEY ("processoId") REFERENCES "Processo"("id"),
      UNIQUE ("processoId", "indice")
    )
  `);

  await knex.raw(`
    CREATE TRIGGER altera_coluna_atualizadoem
      BEFORE UPDATE ON "ProcessoItem"
      FOR EACH ROW EXECUTE PROCEDURE altera_coluna_atualizadoem()
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.raw('DROP TRIGGER altera_coluna_atualizadoem ON "ProcessoItem"');
  await knex.raw('DROP TABLE "ProcessoItem"');
};
