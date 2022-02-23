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
    const setting = await this.setting.get_setting();
    const entity = await this._page_agg_repo.ensure_entity(
      PageEntity.get_date_title(article.saved_at),
      setting,
    );
    await entity.add_article(article);
    return { status: 1 };
  }

  async remove_article(article: iArticle) {
    const setting = await this.setting.get_setting();
    const entity = await this._page_agg_repo.ensure_entity(
      PageEntity.get_date_title(article.saved_at),
      setting,
    );
    await entity.remove_article(article);
    return { status: 1 };
  }

  async sync_local_pages() {
    const setting = await this.setting.get_setting();
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

  async get_today() {
    const setting = await this.setting.get_setting();
    return this._page_agg_repo.ensure_entity(
      PageEntity.get_date_title(new Date()),
      setting,
    );
  }

  async get_entity(title: string) {
    const setting = await this.setting.get_setting();
    return this._page_agg_repo.ensure_entity(title, setting);
  }
}
