import { Controller } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly _service: AppService) {}

  async get_version() {
    return { version: "0.3.0" };
  }
}
