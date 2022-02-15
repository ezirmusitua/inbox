import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PageModule } from "page/module";
import { sArticle } from "schema/article";
import { sArticleClip } from "schema/clip";
import { SettingModule } from "setting/module";
import { ArticleController } from "./controller";
import { ArticleService } from "./service";

@Module({
  imports: [
    TypeOrmModule.forFeature([sArticle, sArticleClip]),
    SettingModule,
    PageModule,
  ],
  providers: [ArticleService],
  exports: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
