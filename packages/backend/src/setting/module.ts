import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { sSetting } from "schema/setting";
import { SettingConfig } from "./config";
import { SettingController } from "./controller";
import { SettingService } from "./service";

@Module({
  imports: [TypeOrmModule.forFeature([sSetting])],
  providers: [SettingService, SettingConfig],
  exports: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
