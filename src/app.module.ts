import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { KnexModule } from "./knex/knex.module";
import { PortalDeComprasPublicasModule } from "./portal-de-compras-publicas/portal-de-compras-publicas.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    KnexModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: configService.getOrThrow("POSTGRES_URL"),
      }),
    }),
    PortalDeComprasPublicasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
