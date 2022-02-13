import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from "@nestjs/common";
import { SettingService } from "setting/service";
import { ArticlePageEntity } from "./domain/agg/entity";
import { Printer } from "./domain/agg/pdf";
import { SummaryService } from "./domain/summary.service";
import { MakeSnippetDto, SaveArticleDto } from "./dto";

const MAX_BACK_TRACE_DAYS = 365;

@Injectable()
export class ArticleService
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  private _summary = new SummaryService(this.setting);

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
    await entity.upsert_article([{ ...article, saved_at: new Date() }]);
    this.refresh_summary();
    return { data: entity.data, status: 1 };
  }

  refresh_summary() {
    const data = this._summary.refresh_summary();
    return { data, status: 1 };
  }

  list_article() {
    const data = this._summary.list();
    return { data, status: 1 };
  }

  remove_article(url_hash: string) {
    const setting = this.setting.get_setting();
    const target = this._summary.remove_article(url_hash);
    if (target) {
      const day_entity = ArticlePageEntity.read_from_file(
        target._day_file,
        setting.logseq_asset_dir_path,
        setting.logseq_journal_dir_path,
      );
      day_entity.remove_article(url_hash);
    }
    return { status: 1 };
  }

  make_snippet(dto: MakeSnippetDto) {
    const summary_entity = this._summary.get_entity();
    summary_entity.make_snippet(dto.url, dto.title, dto.selection);
    // TODO: each article should be saved to a file.
  }

  private get_today_entity() {
    const setting = this.setting.get_setting();
    return ArticlePageEntity.read_from_file(
      setting.today_article_path,
      setting.logseq_asset_dir_path,
      setting.logseq_journal_dir_path,
    );
  }
}
