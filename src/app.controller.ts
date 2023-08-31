import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiKeyGuard } from "./api-key.guard";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @UseGuards(ApiKeyGuard)
  @Get("extraction/force")
  async forceExtraction() {
    if (!this.service.running) {
      await this.service.extract();
    }

    return { running: this.service.running };
  }

  @UseGuards(ApiKeyGuard)
  @Get("extraction/status")
  async getExtractionStatus() {
    const { running } = this.service;
    return { running };
  }

  @Get("health")
  async health() {
    return { message: "ok" };
  }
}
