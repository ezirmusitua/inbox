import { Module } from "@nestjs/common";
import { ArticleService } from "./service";
import { ArticleController } from "./controller";

@Module({
  imports: [],
  providers: [ArticleService],
  exports: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
