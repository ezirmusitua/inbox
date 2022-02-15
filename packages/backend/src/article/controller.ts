import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
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

  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove_article(id);
  }

  @Post("/clip")
  make_clip(@Body() dto: MakeSnippetDto) {
    return this.service.make_snippet(dto);
  }
}
