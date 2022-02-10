import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { SaveArticleDto } from "./dto";
import { ArticleService } from "./service";

@Controller("api/article")
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  @Post("")
  save_article(@Body() article: SaveArticleDto) {
    return this.service.save_article(article);
  }

  @Get("/today")
  get_today() {
    return this.service.get_today_article();
  }

  @Put("/summary")
  refresh_summary() {
    return this.service.refresh_summary();
  }

  @Get("/")
  list() {
    return this.service.list_article();
  }
}
