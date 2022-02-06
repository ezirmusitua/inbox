import { DateTime, Duration } from "luxon";
import { SettingService } from "setting/service";
import { ArticleEntity } from "./domain/agg/entity";

const MAX_BACK_TRACE_DAYS = 365;

export class ArticleService {
  constructor(private readonly setting: SettingService) {}
  async get_today_article() {
    const setting = await this.setting.get_setting();
    const today_file_path = setting.today_path;
    const entity = await ArticleEntity.read_from_file(today_file_path);
    return { data: entity.data, status: 1 };
  }

  async refresh_summary() {
    const setting = await this.setting.get_setting();
    const summary_entity = await ArticleEntity.read_from_file(
      setting.summary_path,
    );
    const all_path = await setting.get_all_path();
    const daily_path = all_path.filter((p) => p !== setting.summary_path);
    for (const fp of daily_path) {
      const daily_entity = await ArticleEntity.read_from_file(fp);
      summary_entity.add_article(daily_entity.article);
    }
    await summary_entity.save();
    return { data: summary_entity.data, status: 1 };
  }

  async list_article() {
    const setting = await this.setting.get_setting();
    const summary_entity = await ArticleEntity.read_from_file(
      setting.summary_path,
    );
    return { data: summary_entity.data, status: 1 };
  }
}
