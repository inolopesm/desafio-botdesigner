import { Global, Module } from "@nestjs/common";
import { PortalDeComprasPublicasProvider } from "./portal-de-compras-publicas.provider";

@Global()
@Module({
  providers: [PortalDeComprasPublicasProvider],
  exports: [PortalDeComprasPublicasProvider],
})
export class PortalDeComprasPublicasModule {}
