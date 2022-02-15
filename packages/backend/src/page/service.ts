import { iArticle } from "@inbox/shared";
import { Injectable, NotImplementedException } from "@nestjs/common";
import { SettingService } from "setting/service";
import { PageEntity } from "./domain/agg/entity";
import { SummaryService } from "./domain/summary.service";

@Injectable()
export class PageService {
  constructor(private readonly setting: SettingService) {}

  private _summary = new SummaryService(this.setting);

  list_today_article() {
    const entity = this.get_today_entity();
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

  // TODO: use agg repo
  private get_today_entity() {
    const setting = this.setting.get_setting();
    return PageEntity.read_from_file(
      setting.today_article_path,
      setting.logseq_asset_dir_path,
      setting.logseq_journal_dir_path,
    );
  }
}
