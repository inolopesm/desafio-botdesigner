import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { PortalDeComprasPublicasProvider } from "./portal-de-compras-publicas.provider";
import { AppService } from "./app.service";
import { KnexProvider } from "./knex.provider";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [PortalDeComprasPublicasProvider, KnexProvider, AppService],
})
export class AppModule {}
