import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { PortalDeComprasPublicasProvider } from "./portal-de-compras-publicas.provider";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [
    {
      provide: PortalDeComprasPublicasProvider,
      useFactory: () =>
        new PortalDeComprasPublicasProvider(async (url) => {
          const response = await fetch(url);
          const data = await response.json();
          return data;
        }),
    },
  ],
})
export class AppModule {}
