import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { MakeSnippetDto, SaveArticleDto } from "./dto";
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

  @Delete("/:url_hash")
  remove(@Param("url_hash") url_hash: string) {
    return this.service.remove_article(url_hash);
  }

  @Post("/snippet")
  make_snippet(@Body() payload: MakeSnippetDto) {
    return this.service.make_snippet(payload);
  }
}
