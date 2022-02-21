import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { sArticle } from "schema/article";
import { sPage } from "schema/page";
import { SettingModule } from "setting/module";
import { PageService } from "./service";

@Module({
  imports: [SettingModule, TypeOrmModule.forFeature([sPage, sArticle])],
  providers: [PageService],
  exports: [PageService],
  controllers: [],
})
export class PageModule {}
