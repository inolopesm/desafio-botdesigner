import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import knex, { type Knex } from "knex";

@Injectable()
export class KnexProvider {
  readonly client: Knex;

  constructor(configService: ConfigService) {
    const url = configService.getOrThrow("POSTGRES_URL");
    this.client = knex({ client: "pg", connection: url });
  }
}
