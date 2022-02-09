import { Module } from "@nestjs/common";
import { ArticleService } from "./service";
import { ArticleController } from "./controller";
import { SettingModule } from "setting/module";

@Module({
  imports: [SettingModule],
  providers: [ArticleService],
  exports: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
