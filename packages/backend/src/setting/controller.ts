import {
  InitSettingDto,
  UpdateBackendSettingDto,
  UpdateLogseqSettingDto,
} from "@inbox/shared";
import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { SettingService } from "./service";

@Controller("api/setting")
export class SettingController {
  constructor(private readonly service: SettingService) {}

  @Get("")
  async get_setting() {
    const entity = await this.service.get_setting();
    return { data: entity.data, status: 1 };
  }

  @Post("")
  init_setting(@Body() dto: InitSettingDto) {
    return this.service.init_setting(dto);
  }

  @Put("/backend")
  update_backend_setting(@Body() dto: UpdateBackendSettingDto) {
    return this.service.update_backend_setting(dto);
  }

  @Put("/logseq")
  update_logseq_setting(@Body() dto: UpdateLogseqSettingDto) {
    return this.service.update_logseq_setting(dto);
  }
}
