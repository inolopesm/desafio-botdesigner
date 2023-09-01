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
  providers: [
    {
      provide: PortalDeComprasPublicasProvider,
      useValue: new PortalDeComprasPublicasProvider(async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      }),
    },
    KnexProvider,
    AppService,
  ],
})
export class AppModule {}
