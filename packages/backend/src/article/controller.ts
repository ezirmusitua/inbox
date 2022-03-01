import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { TakeClipDto, SaveArticleDto } from "./dto";
import { ArticleService } from "./service";

@Controller("api/article")
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  @Get("/")
  list() {
    return this.service.list();
  }

  @Get("/today")
  list_today() {
    return this.service.list_today();
  }

  @Post("")
  save_article(@Body() article: SaveArticleDto) {
    return this.service.save(article);
  }

  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post("/clip")
  take_clip(@Body() dto: TakeClipDto) {
    console.log("call make_clip: ", dto);
    return this.service.take_clip(dto);
  }

  @Post("/database")
  rebuild_database() {
    return this.service.rebuild_database();
  }
}
