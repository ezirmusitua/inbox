import { iArticle } from "@inbox/shared";
import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { sArticle } from "schema/article";
import { sPage } from "schema/page";
import { SettingService } from "setting/service";
import { Repository } from "typeorm";
import { PageEntity } from "./domain/agg/entity";
import { PageAggRepo } from "./domain/agg/repo";
import { SummaryService } from "./domain/summary.service";

@Injectable()
export class PageService {
  private readonly _page_agg_repo = new PageAggRepo(
    this._page_repo,
    this._article_repo,
  );

  constructor(
    @InjectRepository(sPage)
    private readonly _page_repo: Repository<sPage>,
    @InjectRepository(sArticle)
    private readonly _article_repo: Repository<sArticle>,
    private readonly setting: SettingService,
  ) {}

  private _summary = new SummaryService(this.setting);

  list_today_article() {
    // const
    const entity = [];
    return { data: entity.data, status: 1 };
  }

  list_all_article() {
    const data = this._summary.list();
    return { data, status: 1 };
  }

  refresh_summary() {
    const data = this._summary.refresh_summary();
    return { data, status: 1 };
  }

  add_article(article: iArticle) {
    throw new NotImplementedException("");
  }

  remove_article(article: iArticle) {
    throw new NotImplementedException("");
  }

  sync_local_pages() {
    const setting = this.setting.get_setting();
    return PageEntity.sync_local_pages(setting, this._page_agg_repo);
  }
}
