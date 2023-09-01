import { Inject, Injectable } from "@nestjs/common";
import knex, { type Knex } from "knex";
import { KNEX_OPTIONS } from "./constants";
import { KnexOptions } from "./knex-options.interface";

@Injectable()
export class KnexProvider {
  readonly client: Knex;

  constructor(@Inject(KNEX_OPTIONS) options: KnexOptions) {
    this.client = knex({ client: "pg", ...options });
  }
}
