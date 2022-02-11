import * as fs from "fs";
import * as path from "path";
import { join_indent, parse_indent } from "utils";
import { iArticle, iStructuredContent } from "@inbox/shared";
import { Pdf } from "./pdf";
import { DateTime } from "luxon";

export class ArticleEntity {
  public readonly _title = this._path.split(path.sep).pop();
  private _url_set = new Set<string>(this._data.map((d) => d.url));

  constructor(
    private readonly _path: string,
    private _data: iArticle[],
    private asset_dir: string,
  ) {}

  get data() {
    return {
      title: this._title,
      items: this._data.map((i) => ({ ...i, saved_at: new Date(i.saved_at) })),
    };
  }

  get article() {
    return this._data;
  }

  async add_article(article: iArticle[]) {
    for (const item of article) {
      console.log(`add article: ${item.url}, ${item.pdf}`);
      if (!this._url_set.has(item.url)) {
        this._data.push(item);
        this._data.sort((p, n) => n.saved_at.getTime() - p.saved_at.getTime());
        this._url_set.add(item.url);
        if (item.content && !item.pdf) {
          const pdf = new Pdf(item.content);
          const buffer = await pdf.generate();
          const pdf_name = `${DateTime.fromJSDate(item.saved_at).toFormat(
            "yyyy_MM_dd",
          )}-${item.title}.pdf`;
          item.pdf = `SOURCE: ![${item.title.replace(
            / /g,
            "_",
          )}.pdf](../assets/${pdf_name})`;
          this.save_asset(buffer, pdf_name);
        }
      }
    }
    return this;
  }

  save_asset(content: Buffer, name: string) {
    fs.writeFileSync(path.join(this.asset_dir, name), content);
  }

  save() {
    return fs.writeFileSync(
      this._path,
      join_indent(
        this._data.map((article) => ({
          content: article.title,
          children: [article.url, article.saved_at, article.pdf],
        })),
      ),
    );
  }

  static read_from_file(path: string, asset_dir: string) {
    try {
      const content = fs.readFileSync(path).toString();
      const structured = parse_indent(content);
      return new ArticleEntity(
        path,
        ArticleEntity.convert_to_article(structured),
        asset_dir,
      );
    } catch (e) {
      console.log(e);
      return new ArticleEntity(path, [], asset_dir);
    }
  }

  static convert_to_article(structured: iStructuredContent) {
    return structured.children.map(({ content, children }) => {
      return {
        title: content.slice(2),
        url: children[0].content.slice(2),
        saved_at: new Date(children[1].content.slice(2)),
        pdf: children[2]?.content?.slice(2),
      };
    });
  }
}
