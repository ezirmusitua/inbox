import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { join_indent, parse_indent } from "utils";
import { iArticle, iArticlePayload, iStructuredContent } from "@inbox/shared";
import { Pdf } from "./pdf";
import { DateTime } from "luxon";

function md5(content: string) {
  return crypto.createHash("md5").update(content).digest("base64url");
}

export class ArticleEntity {
  public readonly _title = this._path.split(path.sep).pop();
  private _url_hash_set = new Set<string>(this._data.map((d) => d._url_hash));

  constructor(
    private readonly _path: string,
    private _data: iArticle[],
    private asset_dir: string,
  ) {}

  get data() {
    return {
      title: this._title,
      items: this._data.map((i) => ({
        ...i,
        _day_file: i._day_file || this._path,
        saved_at: new Date(i.saved_at),
      })),
    };
  }

  get article() {
    return this._data;
  }

  get_article(url_hash: string) {
    return this._data.find((article) => article._url_hash === url_hash);
  }

  remove_article(url_hash: string) {
    const index = this._data.findIndex(
      (article) => article._url_hash === url_hash,
    );
    const spliced = this._data.splice(index, 1);
    const removed = Array.isArray(spliced) ? spliced[0] : spliced;
    if (removed.pdf) {
      this.remove_pdf(removed.pdf);
    }
    this._url_hash_set = new Set<string>(this._data.map((d) => d._url_hash));
    return removed;
  }

  async add_article(article: iArticle[]) {
    for (const item of article) {
      const url_hash = md5(item.url);
      if (!this._url_hash_set.has(url_hash)) {
        item._url_hash = item._url_hash || url_hash;
        item._day_file = item._day_file || this._path;
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
          this.save_pdf(buffer, pdf_name);
        }
        this._data.push(item);
        this._data.sort((p, n) => n.saved_at.getTime() - p.saved_at.getTime());
        this._url_hash_set.add(url_hash);
      }
    }
    return this;
  }

  save_pdf(content: Buffer, name: string) {
    fs.writeFileSync(path.join(this.asset_dir, name), content);
  }

  remove_pdf(pdf_uri: string) {
    const asset_name = /^SOURCE: !\[(.*)\]\(\.\.\/assets\/(.*)\)$/.exec(
      pdf_uri,
    )[2];
    console.log("to remove asset: ", asset_name);
    const asset_path = path.join(this.asset_dir, asset_name);
    if (fs.existsSync(asset_path)) {
      fs.unlinkSync(asset_path);
    }
  }

  save() {
    return fs.writeFileSync(
      this._path,
      join_indent(
        this._data.map((article) => ({
          content: article.title,
          children: [
            article._url_hash,
            article._day_file,
            article.url,
            article.saved_at,
            article.pdf,
          ],
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
      return new ArticleEntity(path, [], asset_dir);
    }
  }

  static convert_to_article(structured: iStructuredContent) {
    return structured.children.map(({ content, children }) => {
      return {
        title: content.slice(2),
        _url_hash: children[0].content.slice(2),
        _day_file: children[1].content.slice(2),
        url: children[2].content.slice(2),
        saved_at: new Date(children[3].content.slice(2)),
        pdf: children[4]?.content?.slice(2),
      };
    });
  }
}
