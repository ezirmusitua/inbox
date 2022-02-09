import { Module } from "@nestjs/common";
import { SettingConfig } from "./config";
import { SettingController } from "./controller";
import { SettingService } from "./service";

@Module({
  imports: [],
  providers: [SettingService, SettingConfig],
  exports: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
