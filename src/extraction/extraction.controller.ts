import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiKeyGuard } from "../api-key.guard";
import { ExtractionService } from "./extraction.service";

@Controller({ version: "1" })
export class ExtractionController {
  constructor(private readonly service: ExtractionService) {}

  @UseGuards(ApiKeyGuard)
  @Get("extraction/force")
  async forceExtraction() {
    const running = this.service.getRunning();
    if (!running) void this.service.extract();
    return { requested: !running };
  }

  @UseGuards(ApiKeyGuard)
  @Get("extraction/status")
  async getExtractionStatus() {
    const running = this.service.getRunning();
    return { running };
  }
}
