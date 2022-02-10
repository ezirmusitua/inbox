import { Injectable } from "@nestjs/common";
import { DateTime, Duration } from "luxon";
import { SettingService } from "setting/service";
import { ArticleEntity } from "./domain/agg/entity";
import { SaveArticleDto } from "./dto";

const MAX_BACK_TRACE_DAYS = 365;

@Injectable()
export class ArticleService {
  constructor(private readonly setting: SettingService) {}

  get_today_article() {
    const entity = this.get_today_entity();
    return { data: entity.data, status: 1 };
  }

  async save_article(article: SaveArticleDto) {
    const entity = this.get_today_entity();
    const data = entity.add_article([
      { ...article, saved_at: new Date() },
    ]).data;
    entity.save();
    return { data, status: 1 };
  }

  refresh_summary() {
    const setting = this.setting.get_setting();
    const summary_entity = ArticleEntity.read_from_file(
      setting.article_summary_path,
    );
    const daily_path = setting.all_path.filter(
      (p) => p !== setting.article_summary_path,
    );
    for (const fp of daily_path) {
      const daily_entity = ArticleEntity.read_from_file(fp);
      console.log(daily_entity.article);
      summary_entity.add_article(daily_entity.article);
    }
    summary_entity.save();
    return { data: summary_entity.data, status: 1 };
  }

  list_article() {
    const setting = this.setting.get_setting();
    const summary_entity = ArticleEntity.read_from_file(
      setting.article_summary_path,
    );
    return { data: summary_entity.data, status: 1 };
  }

  private get_today_entity() {
    const setting = this.setting.get_setting();
    return ArticleEntity.read_from_file(setting.today_article_path);
  }
}
