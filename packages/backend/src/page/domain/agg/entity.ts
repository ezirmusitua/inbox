import { iArticle, iPage } from "@inbox/shared";
import { DateTime } from "luxon";
import { SettingEntity } from "setting/domain/agg/entity";
import { read_file_silently, save_file } from "utils";
import { PageArticleList } from "./article_list";
import { PageAST } from "./ast";
import { PageAggRepo } from "./repo";

export class PageEntity {
  public readonly articles = new PageArticleList(this._data, this.repo);
  private readonly ast = new PageAST(this._data);

  constructor(
    private _data: iPage,
    private readonly _setting: SettingEntity,
    private readonly repo: PageAggRepo,
  ) {}

  get data() {
    return this._data;
  }

  get date_label() {
    return PageEntity.get_date_label(this._data._created_at);
  }

  get link_name() {
    return `${this.date_label}-信息列表`;
  }

  get filepath() {
    return this._setting.logseq_page_path(`${this.link_name}.md`);
  }

  async add_article(item: iArticle) {
    await this.articles.add(item);
    this._data.articles = this.articles.data;
    await this.save();
  }

  async remove_article(item: iArticle) {
    this.articles.remove(item);
    this._data.articles = this.articles.data;
    await this.save();
  }

  private async save() {
    await this.append_to_journal();
    await save_file(this.ast.string, this.filepath);
    return this.repo.save_page(this._data);
  }

  private async append_to_journal() {
    if (this._data.appended_to_journal) return;
    const journal_path = this._setting.logseq_journal_path(
      `${this.date_label}.md`,
    );
    let journal_content = await read_file_silently(journal_path);
    if (!journal_content.includes(this.date_label)) {
      journal_content += "\n- INBOX";
      journal_content += `\n\t- [[${this.link_name}}]]`;
      await save_file(journal_content, journal_path);
    }
    this._data.appended_to_journal = true;
  }

  static get_date_label(date: Date) {
    return DateTime.fromJSDate(date).toFormat("yyyy_MM_dd");
  }

  static get_date_title(date: Date) {
    return `${PageEntity.get_date_label(date)}-信息列表`;
  }
}
