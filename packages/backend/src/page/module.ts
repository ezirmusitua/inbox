import { Module } from "@nestjs/common";
import { SettingModule } from "setting/module";
import { PageController } from "./controller";
import { PageService } from "./service";

@Module({
  imports: [SettingModule],
  providers: [PageService],
  exports: [PageService],
  controllers: [PageController],
})
export class PageModule {}
