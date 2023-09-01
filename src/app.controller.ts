import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiKeyGuard } from "./api-key.guard";
import { AppService } from "./app.service";

@Controller({ version: "1" })
export class AppController {
  constructor(private readonly service: AppService) {}

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

  @Get("health")
  async health() {
    return { message: "ok" };
  }
}
