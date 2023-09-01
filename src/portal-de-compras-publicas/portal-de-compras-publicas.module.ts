import { Module } from "@nestjs/common";
import { PortalDeComprasPublicasProvider } from "./portal-de-compras-publicas.provider";

@Module({
  providers: [PortalDeComprasPublicasProvider],
  exports: [PortalDeComprasPublicasProvider],
})
export class PortalDeComprasPublicasModule {}
