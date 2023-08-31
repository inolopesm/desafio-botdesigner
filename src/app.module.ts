import { Module } from "@nestjs/common";
import { PortalDeComprasPublicasProvider } from "./portal-de-compras-publicas.provider";

@Module({
  imports: [],
  controllers: [],
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
