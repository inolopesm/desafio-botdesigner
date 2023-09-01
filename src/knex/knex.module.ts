import {
  type DynamicModule,
  Module,
  type FactoryProvider,
} from "@nestjs/common";

import type { KnexOptions } from "./knex-options.interface";
import { KNEX_OPTIONS } from "./constants";
import { KnexProvider } from "./knex.provider";

type KnexModuleAsyncOptions = Omit<FactoryProvider<KnexOptions>, "provide">;

@Module({})
export class KnexModule {
  static forRootAsync(options: KnexModuleAsyncOptions): DynamicModule {
    return {
      global: true,
      module: KnexModule,
      providers: [{ provide: KNEX_OPTIONS, ...options }, KnexProvider],
      exports: [KnexProvider],
    };
  }
}
