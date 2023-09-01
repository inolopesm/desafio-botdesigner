import { Module } from "@nestjs/common";
import { ExtractionController } from "./extraction.controller";
import { ExtractionService } from "./extraction.service";

@Module({ controllers: [ExtractionController], providers: [ExtractionService] })
export class ExtractionModule {}
