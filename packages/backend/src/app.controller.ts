import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly _service: AppService) {}

  @Get("api/version")
  async get_version() {
    return { version: "0.3.0" };
  }
}
