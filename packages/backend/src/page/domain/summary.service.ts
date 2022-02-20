import { SettingService } from "setting/service";
import { PageAggRepo } from "./agg/repo";

export class SummaryService {
  constructor(private readonly _setting: SettingService) {}

  list() {
    const setting = this._setting.get_setting();
    const summary_entity = PageAggRepo.get_entity_from_file(
      setting.article_summary_path,
      setting.logseq_asset_dir_path,
      setting.logseq_journal_dir_path,
    );
    return summary_entity.data;
  }

  refresh_summary() {
    const summary_entity = this.get_entity();
    const setting = this._setting.get_setting();
    const daily_path = setting.all_article_path.filter(
      (p) => p !== setting.article_summary_path,
    );
    for (const fp of daily_path) {
      const daily_entity = PageAggRepo.get_entity_from_file(
        fp,
        setting.logseq_asset_dir_path,
        setting.logseq_journal_dir_path,
      );
      // summary_entity.upsert_article(daily_entity.article);
    }
    return summary_entity.data;
  }

  remove_article(_url_hash: string) {
    const summary_entity = this.get_entity();
    return summary_entity.remove_article({} as any);
  }

  get_entity() {
    const setting = this._setting.get_setting();
    return PageAggRepo.get_entity_from_file(
      setting.article_summary_path,
      setting.logseq_asset_dir_path,
      setting.logseq_journal_dir_path,
    );
  }
}
