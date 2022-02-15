import { Controller, Get, Put } from "@nestjs/common";
import { PageService } from "./service";

@Controller("api/page")
export class PageController {
  constructor(private readonly _service: PageService) {}

  @Get("/today")
  get_today() {
    return this._service.get_today_article();
  }

  @Get("/")
  list() {
    return this._service.list_article();
  }

  @Put("/summary")
  refresh_summary() {
    return this._service.refresh_summary();
  }
}
