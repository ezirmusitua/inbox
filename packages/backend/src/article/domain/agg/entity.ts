import * as fs from "fs";
import * as path from "path";
import { join_indent, parse_indent } from "utils";
import { iArticle, iStructuredContent } from "@inbox/shared";

export class ArticleEntity {
  public readonly _title = this._path.split(path.sep).pop();
  private _url_set = new Set<string>(this._data.map((d) => d.url));

  constructor(private readonly _path: string, private _data: iArticle[]) {}

  get data() {
    return {
      title: this._title,
      items: this._data,
    };
  }

  get article() {
    return this._data;
  }

  add_article(article: iArticle[]) {
    article.forEach((item) => {
      if (!this._url_set.has(item.url)) {
        this._data.push(item);
        this._data.sort((p, n) => n.saved_at.getTime() - p.saved_at.getTime());
        this._url_set.add(item.url);
      }
    });
    return this;
  }

  save() {
    return fs.writeFileSync(
      this._path,
      join_indent(
        this._data.map((article) => ({
          content: article.title,
          children: [article.url, article.saved_at],
        })),
      ),
    );
  }

  static async read_from_file(path: string) {
    try {
      const content = fs.readFileSync(path).toString();
      const structured = parse_indent(content);
      return new ArticleEntity(
        path,
        ArticleEntity.convert_to_article(structured),
      );
    } catch (e) {
      return new ArticleEntity(path, []);
    }
  }

  static convert_to_article(structured: iStructuredContent) {
    return structured.children.map(({ content, children }) => {
      return {
        title: content.slice(2),
        url: children[0].content.slice(2),
        saved_at: new Date(children[1].content.slice(2)),
      };
    });
  }
}
