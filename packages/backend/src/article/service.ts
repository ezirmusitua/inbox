import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PageService } from "page/service";
import { sArticle } from "schema/article";
import { sArticleClip } from "schema/clip";
import { SettingService } from "setting/service";
import { Repository } from "typeorm";
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
    private readonly _clip_repo: Repository<sArticleClip>,
    private readonly page: PageService,
    private readonly setting: SettingService,
  ) {}

  async onApplicationBootstrap() {
    const browser_path = this.setting.get_setting().browser_path;
    await new Printer(browser_path).initialize();
  }

  async onApplicationShutdown() {
    const browser_path = this.setting.get_setting().browser_path;
    await new Printer(browser_path).destroy();
  }

  async save_article(article: SaveArticleDto) {
    const setting = this.setting.get_setting();
    const entity = await this._article_agg_repo.ensure_entity(article, setting);
    await entity.save(article.content);
    await this.page.add_article(entity.data);
    return { status: 1 };
  }

  async remove_article(id: number) {
    const setting = this.setting.get_setting();
    const entity = await this._article_agg_repo.get_entity(id, setting);
    await entity.remove();
    await this.page.remove_article(entity.data);
    return { status: 1 };
  }

  async make_snippet(dto: MakeSnippetDto) {
    const setting = this.setting.get_setting();
    const entity = await this._article_agg_repo.ensure_entity(
      { url: dto.url, title: dto.title },
      setting,
    );
    await entity.make_clip(dto.selection);
  }
}
