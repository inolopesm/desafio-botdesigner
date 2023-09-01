import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { KnexModule } from "./knex";
import { PortalDeComprasPublicasModule } from "./portal-de-compras-publicas";
import { HealthModule } from "./health";
import { ExtractionModule } from "./extraction";

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
    HealthModule,
    ExtractionModule,
  ],
})
export class AppModule {}
