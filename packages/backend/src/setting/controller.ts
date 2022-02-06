import { InitSettingDto } from "@inbox/shared";
import { Controller, Get, Post, Put } from "@nestjs/common";
import { SettingService } from "./service";

@Controller("api/setting")
export class SettingController {
  constructor(private readonly service: SettingService) {}

  @Get("")
  get_setting() {
    return this.service.get_setting();
  }

  @Post("")
  init_setting(dto: InitSettingDto) {
    return this.service.init_setting(dto);
  }

  @Put("")
  update_setting() {
    return;
  }
}
