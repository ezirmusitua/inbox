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
import { sPage } from "schema/page";
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
    const setting = this.setting.get_setting();
    const browser_path = setting.browser_path;
    await new Printer(browser_path).initialize();
    this.rebuild_database();
  }

  async onApplicationShutdown() {
    const browser_path = this.setting.get_setting().browser_path;
    await new Printer(browser_path).destroy();
  }

  async list() {
    const items = await this._article_agg_repo.list();
    return { data: { items, total: items.length }, status: 1 };
  }

  async list_today() {
    const entity = await this.page.get_entity(
      new DateTime().toFormat("yyyy_MM_dd-信息列表"),
    );
    return { data: entity.data, status: 1 };
  }

  async save(article: SaveArticleDto) {
    const setting = this.setting.get_setting();
    const entity = await this._article_agg_repo.ensure_entity(article, setting);
    await entity.save(article.content);
    await this.page.add_article(entity.data);
    return { status: 1 };
  }

  async remove(id: number) {
    const setting = this.setting.get_setting();
    const entity = await this._article_agg_repo.get_entity(id, setting);
    await entity.remove();
    await this.page.remove_article(entity.data);
    return { status: 1 };
  }

  async make_clip(dto: MakeSnippetDto) {
    const setting = this.setting.get_setting();
    const entity = await this._article_agg_repo.ensure_entity(
      { url: dto.url, title: dto.title },
      setting,
    );
    await entity.make_clip(dto.selection);
  }

  async rebuild_database() {
    // TODO: drop old database
    // TODO: sync clips
    // TODO: implement logseq markdown file parser & builder
    // TODO: return raw page data
    const pages = await this.page.sync_local_pages();
    const setting = this.setting.get_setting();
    for (const page of pages) {
      for (const article of page.articles) {
        const saved_clips = await this._clip_repo.save(
          article.clips.map((item) => ({
            ...item,
            note: (item.note as any).join("\n"),
          })),
        );
        console.log(saved_clips);
        article.clips = saved_clips;
        article.url_hash = hash(article.url);
        const saved_article = await this._article_repo.save(article);
        await this.page.add_article(saved_article);
      }
    }
  }
}
