import { Module } from "@nestjs/common";
import { ExtractionController } from "./extraction.controller";
import { ExtractionService } from "./extraction.service";
import { ProcessosController } from "./processos.controller";

@Module({
  controllers: [ExtractionController, ProcessosController],
  providers: [ExtractionService],
})
export class ExtractionModule {}
