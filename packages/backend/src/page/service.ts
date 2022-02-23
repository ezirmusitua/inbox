import { iArticle, iPage } from "@inbox/shared";
import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DateTime } from "luxon";
import { sArticle } from "schema/article";
import { sPage } from "schema/page";
import { SettingService } from "setting/service";
import { Repository } from "typeorm";
import { PageEntity } from "./domain/agg/entity";
import { PageAggRepo } from "./domain/agg/repo";

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

  async add_article(article: iArticle) {
    const entity = await this._page_agg_repo.ensure_entity(
      PageEntity.get_date_title(article.saved_at),
      this.setting.get_setting(),
    );
    return entity.add_article(article);
  }

  remove_article(article: iArticle) {
    throw new NotImplementedException("");
  }

  async sync_local_pages() {
    const setting = this.setting.get_setting();
    const pages_data = await PageAggRepo.sync_local_pages(setting);
    const saved_pages: iPage[] = [];
    for (const page of pages_data) {
      const saved_page = await this._page_agg_repo.save_page({
        title: page.title,
      });
      saved_pages.push({
        ...page,
        ...saved_page,
      });
    }
    return saved_pages;
  }

  drop_page_database() {
    return this._page_agg_repo.drop_page_database();
  }

  get_today() {
    return this._page_agg_repo.ensure_entity(
      PageEntity.get_date_title(new Date()),
      this.setting.get_setting(),
    );
  }

  get_entity(title: string) {
    return this._page_agg_repo.ensure_entity(title, this.setting.get_setting());
  }
}
