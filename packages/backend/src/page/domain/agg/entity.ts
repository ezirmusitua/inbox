import { iArticle, iPage } from "@inbox/shared";
import * as fs from "fs";
import { DateTime } from "luxon";
import path from "path";
import { join_indent, parse_indent } from "utils";
import { PageArticleList } from "./article_list";
import { PageAggRepo } from "./repo";

export class PageEntity {
  public readonly articles = new PageArticleList(
    this._data.articles,
    this.repo,
  );
  constructor(private _data: iPage, private readonly repo: PageAggRepo) {}

  get data() {
    return this._data;
  }

  get filepath() {
    return `${DateTime.fromJSDate(this._data._created_at).toFormat(
      "yyyy_MM_dd",
    )}-信息列表.md`;
  }

  async add_article(item: iArticle) {
    this.articles.add(item);
    await this.save();
  }

  remove_article(item: iArticle) {
    this.articles.remove(item);
  }

  private save() {
    // TODO: use fs with Promise
    // TODO: save to database
    // TODO: save to filesystem
    fs.writeFileSync(
      this._path,
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
    this.append_to_journal();
  }
  private append_to_journal() {
    const journal_name = this._title.slice(0, 10);
    const journal_path = path.join(this.journal_dir, `${journal_name}.md`);
    if (!fs.existsSync(journal_path)) {
      fs.writeFileSync(journal_path, "");
    }
    let journal_content = fs.readFileSync(journal_path).toString();
    // TODO: maybe make a copy at first?
    if (!journal_content.includes(this._title)) {
      journal_content += "\n- INBOX";
      journal_content += `\n	- [[${this._title}]]`;
      fs.writeFileSync(journal_path, journal_content);
    }
  }

  // TODO: move to repo
  static read_from_file(path: string, asset_dir: string, journal_dir: string) {
    try {
      const content = fs.readFileSync(path).toString();
      const structured = parse_indent(content);
      return new PageEntity(
        path,
        {} as any, // PageEntity.convert_to_article(structured),
        asset_dir,
        journal_dir,
      );
    } catch (e) {
      return new PageEntity(path, [], asset_dir, journal_dir);
    }
  }
}
