import { iArticle, iPage } from "@inbox/shared";
import * as fs from "fs";
import { DateTime } from "luxon";
import { SettingEntity } from "setting/domain/agg/entity";
import { join_indent } from "utils";
import { iASTreeNode } from "utils/ast";
import { PageArticleList } from "./article_list";
import { PageAggRepo } from "./repo";

export class PageEntity {
  public readonly articles = new PageArticleList(
    this._data.articles,
    this.repo,
  );

  constructor(
    private _data: iPage,
    private _setting: SettingEntity,
    private readonly repo: PageAggRepo,
  ) {}

  get data() {
    return this._data;
  }

  get date_label() {
    return DateTime.fromJSDate(this._data._created_at).toFormat("yyyy_MM_dd");
  }

  get link_name() {
    return `${this.date_label}-信息列表`;
  }

  get filepath() {
    return this._setting.logseq_page_path(`${this.link_name}.md`);
  }

  async add_article(item: iArticle) {
    this.articles.add(item);
    await this.save();
  }

  async remove_article(item: iArticle) {
    this.articles.remove(item);
    await this.save();
  }

  private async save() {
    // TODO: use fs with Promise
    // TODO: save to database
    // TODO: save to filesystem
    fs.writeFileSync(
      this.filepath,
      join_indent(
        this._data.articles.map((article) => ({
          content: article.title,
          children: [
            article.url_hash,
            article.page,
            article.url,
            article.saved_at,
            article.pdf,
            (article.clips || []).join("\n"),
          ],
        })),
      ),
    );
    await this.append_to_journal();
    this._data = await this.repo.save_page(this._data);
    return this;
  }

  private async append_to_journal() {
    const journal_path = this._setting.logseq_journal_path(
      `${this.date_label}.md`,
    );
    let journal_content = "";
    if (fs.existsSync(journal_path)) {
      journal_content = await new Promise((resolve) =>
        fs.readFile(journal_path, (_, data) => resolve(data.toString())),
      );
    }
    // TODO: maybe make a copy at first?
    if (!journal_content.includes(this.date_label)) {
      journal_content += "\n- INBOX";
      journal_content += `\n	- [[${this.link_name}}]]`;
      return new Promise((resolve) =>
        fs.writeFile(journal_path, journal_content, (_) => resolve(true)),
      );
    }
  }
}
