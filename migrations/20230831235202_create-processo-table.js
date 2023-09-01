/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE "Processo" (
      "id" SERIAL8 NOT NULL,
      "codigoLicitacao" INT8 NOT NULL,
      "identificacao" TEXT NOT NULL,
      "numero" TEXT NOT NULL,
      "resumo" TEXT NOT NULL,
      "codigoSituacaoEdital" SMALLINT NOT NULL,
      "statusCodigo" SMALLINT NOT NULL,
      "dataHoraInicioLances" TIMESTAMP NOT NULL,
      "criadoEm" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "atualizadoEm" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY ("id"),
      UNIQUE ("codigoLicitacao")
    )
  `);

  await knex.raw(`
    CREATE OR REPLACE FUNCTION altera_coluna_atualizadoem()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW."atualizadoEm" = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `);

  await knex.raw(`
    CREATE TRIGGER altera_coluna_atualizadoem
      BEFORE UPDATE ON "Processo"
      FOR EACH ROW EXECUTE PROCEDURE altera_coluna_atualizadoem();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw('DROP TRIGGER altera_coluna_atualizadoem ON "Processo"');
  await knex.raw("DROP FUNCTION altera_coluna_atualizadoem()");
  await knex.raw('DROP TABLE "Processo"');
};
