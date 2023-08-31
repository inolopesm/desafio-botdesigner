import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiKeyGuard } from "./api-key.guard";

@Controller()
export class AppController {
  @UseGuards(ApiKeyGuard)
  @Get("force-extraction")
  async forceExtraction() {
    return true;
  }

  @Get("health")
  async health() {
    return { message: "ok" };
  }
}
