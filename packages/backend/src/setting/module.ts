import { Module } from "@nestjs/common";
import { SettingService } from "./service";
import { SettingController } from "./controller";

@Module({
  imports: [],
  providers: [SettingService],
  exports: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
