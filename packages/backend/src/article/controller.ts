import { Controller, Get, Put } from "@nestjs/common";
import { ArticleService } from "./service";

@Controller("api/article")
export class ArticleController {
  constructor(private readonly service: ArticleService) {}
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
