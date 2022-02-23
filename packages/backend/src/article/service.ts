import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DateTime } from "luxon";
import { PageService } from "page/service";
import { sArticle } from "schema/article";
import { sArticleClip } from "schema/clip";
import { SettingService } from "setting/service";
import { Repository } from "typeorm";
import { hash } from "utils";
import { Printer } from "./domain/agg/pdf";
import { ArticleAggRepo } from "./domain/agg/repo";
import { MakeSnippetDto, SaveArticleDto } from "./dto";

@Injectable()
export class ArticleService
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  private _article_agg_repo = new ArticleAggRepo(
    this._article_repo,
    this._clip_repo,
  );

  constructor(
    @InjectRepository(sArticle)
    private readonly _article_repo: Repository<sArticle>,
    @InjectRepository(sArticleClip)
    private readonly _clip_repo: Repository<sArticleClip>,
    private readonly page: PageService,
    private readonly setting: SettingService,
  ) {}

  async onApplicationBootstrap() {
    const setting = await this.setting.get_setting();
    const browser_path = setting.browser_path;
    await new Printer(browser_path).initialize();
    await this.rebuild_database();
  }

  async onApplicationShutdown() {
    const setting = await this.setting.get_setting();
    const browser_path = setting.browser_path;
    await new Printer(browser_path).destroy();
  }

  async list() {
    const items = await this._article_agg_repo.list();
    return { data: { items, total: items.length }, status: 1 };
  }

  async list_today() {
    const entity = await this.page.get_today();
    const items = entity.articles.data;
    return {
      data: { items, total: items.length },
      status: 1,
    };
  }

  async save(article: SaveArticleDto) {
    const setting = await this.setting.get_setting();
    const entity = await this._article_agg_repo.ensure_entity(article, setting);
    await entity.save(article.content);
    await this.page.add_article(entity.data);
    return { status: 1 };
  }

  async remove(id: number) {
    const setting = await this.setting.get_setting();
    const entity = await this._article_agg_repo.get_entity(id, setting);
    await entity.remove();
    console.log("remove ", id);
    await this.page.remove_article(entity.data);
    return { status: 1 };
  }

  async make_clip(dto: MakeSnippetDto) {
    const setting = await this.setting.get_setting();
    const entity = await this._article_agg_repo.ensure_entity(
      { url: dto.url, title: dto.title },
      setting,
    );
    await entity.make_clip(dto.selection);
  }

  async rebuild_database() {
    await this.page.drop_page_database();
    await this._article_agg_repo.drop_article_database();
    const pages = await this.page.sync_local_pages();
    const articles = [];
    // TODO: handle duplicated articles
    // TODO: do database operation in agg repo
    const url_set = new Set();
    for (const page of pages) {
      for (const article of page.articles) {
        const _url_hash = hash(article.url);
        if (!url_set.has(_url_hash)) {
          url_set.add(_url_hash);
          const saved_clips = await this._clip_repo.save(
            article.clips.map((item) => ({
              ...item,
              note: (item.note as any).join("\n"),
            })),
          );
          article.page = page;
          article.clips = saved_clips;
          article._url_hash = _url_hash;
          articles.push(article);
        }
      }
    }
    await this._article_repo.save(articles);
  }
}
