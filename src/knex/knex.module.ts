import {
  type DynamicModule,
  Module,
  type FactoryProvider,
} from "@nestjs/common";

import type { KnexOptions } from "./knex-options.interface";
import { KNEX_OPTIONS } from "./constants";
import { KnexProvider } from "./knex.provider";

@Module({})
export class KnexModule {
  static forRootAsync(
    options: Omit<FactoryProvider<KnexOptions>, "provide">
  ): DynamicModule {
    return {
      module: KnexModule,
      providers: [{ provide: KNEX_OPTIONS, ...options }, KnexProvider],
      exports: [KnexProvider],
    };
  }
}
