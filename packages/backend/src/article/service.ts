import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from "@nestjs/common";
import { DateTime, Duration } from "luxon";
import { SettingService } from "setting/service";
import { ArticleEntity } from "./domain/agg/entity";
import { Printer } from "./domain/agg/pdf";
import { SaveArticleDto } from "./dto";

const MAX_BACK_TRACE_DAYS = 365;

@Injectable()
export class ArticleService
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  constructor(private readonly setting: SettingService) {}

  async onApplicationBootstrap() {
    const browser_path = this.setting.get_setting().browser_path;
    await new Printer(browser_path).initialize();
  }

  async onApplicationShutdown() {
    const browser_path = this.setting.get_setting().browser_path;
    await new Printer(browser_path).destroy();
  }

  get_today_article() {
    const entity = this.get_today_entity();
    return { data: entity.data, status: 1 };
  }

  async save_article(article: SaveArticleDto) {
    const entity = this.get_today_entity();
    const result = await entity.add_article([
      { ...article, saved_at: new Date() },
    ]);
    entity.save();
    this.refresh_summary();
    return { data: result.data, status: 1 };
  }

  refresh_summary() {
    const summary_entity = this.get_summary_entity();
    const setting = this.setting.get_setting();
    const daily_path = setting.all_article_path.filter(
      (p) => p !== setting.article_summary_path,
    );
    for (const fp of daily_path) {
      const daily_entity = ArticleEntity.read_from_file(
        fp,
        setting.logseq_asset_dir_path,
      );
      summary_entity.add_article(daily_entity.article);
    }
    summary_entity.save();
    return { data: summary_entity.data, status: 1 };
  }

  list_article() {
    const setting = this.setting.get_setting();
    const summary_entity = ArticleEntity.read_from_file(
      setting.article_summary_path,
      setting.logseq_asset_dir_path,
    );
    return { data: summary_entity.data, status: 1 };
  }

  remove_article(url_hash: string) {
    const setting = this.setting.get_setting();
    const summary_entity = this.get_summary_entity();
    const target = summary_entity.remove_article(url_hash);
    if (target) {
      summary_entity.save();
      const day_entity = ArticleEntity.read_from_file(
        target._day_file,
        setting.logseq_asset_dir_path,
      );
      day_entity.remove_article(url_hash);
      day_entity.save();
    }
    return { status: 1 };
  }

  private get_today_entity() {
    const setting = this.setting.get_setting();
    return ArticleEntity.read_from_file(
      setting.today_article_path,
      setting.logseq_asset_dir_path,
    );
  }

  private get_summary_entity() {
    const setting = this.setting.get_setting();
    return ArticleEntity.read_from_file(
      setting.article_summary_path,
      setting.logseq_asset_dir_path,
    );
  }
}
