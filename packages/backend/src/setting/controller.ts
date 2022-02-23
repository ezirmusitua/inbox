import { InitSettingDto } from "@inbox/shared";
import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { UpdateSettingDto } from "./dto";
import { SettingService } from "./service";

@Controller("api/setting")
export class SettingController {
  constructor(private readonly service: SettingService) {}

  @Get("")
  get_setting() {
    return this.service.get_setting();
  }

  @Post("")
  init_setting(@Body() dto: InitSettingDto) {
    return this.service.init_setting(dto);
  }

  @Put("")
  update_setting(@Body() dto: UpdateSettingDto) {
    return this.service.update_setting(dto);
  }

  // TODO: move rebuild database to setting module
}
