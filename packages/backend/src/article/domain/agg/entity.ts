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

  async upsert_article(article: iArticle[]) {
    for (const item of article) {
      const url_hash = md5(item.url);
      const existed = this.get_article(url_hash);
      if (existed) {
        this.update_article(item);
      } else {
        this.add_article(item);
      }
    }
  }

  async add_article(item: iArticle) {
    const url_hash = md5(item.url);
    if (!this._url_hash_set.has(url_hash)) {
      item._url_hash = item._url_hash || url_hash;
      item._day_file = item._day_file || this._path;
      this._data.push(item);
      this._url_hash_set.add(url_hash);
      await this.update_article(item);
    }
  }

  async update_article(new_one: iArticle, old_one?: iArticle) {
    // TODO: save content hash
    // TODO: compare new_one.content with old_one, if same, do not generate pdf
    if (new_one.content && !new_one.pdf) {
      const pdf = new Pdf(new_one.content);
      const buffer = await pdf.generate();
      const pdf_name = `${DateTime.fromJSDate(new_one.saved_at).toFormat(
        "yyyy_MM_dd",
      )}-${new_one.title}.pdf`;
      new_one.pdf = `SOURCE: ![${new_one.title.replace(
        / /g,
        "_",
      )}.pdf](../assets/${pdf_name})`;
      this.save_pdf(buffer, pdf_name);
    }
    this._data = this._data.map((item) => {
      if (item._url_hash !== new_one._url_hash) return item;
      return new_one;
    });
    this._data = this._data.sort(
      (p, n) => n.saved_at.getTime() - p.saved_at.getTime(),
    );
    this.save();
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
    this.save();
    return removed;
  }

  async make_snippet(url: string, title: string, selection: string) {
    const _url_hash = md5(url);
    const article = this.get_article(_url_hash);
    if (!article) {
      this.add_article({
        title,
        url,
        _url_hash: _url_hash,
        saved_at: new Date(),
        notes: [selection],
      });
    } else {
      const new_notes = [...(article.notes || []), selection];
      await this.update_article({ ...article, notes: new_notes }, article);
    }
    console.log("article snippet to save: ", article);
    this.save();
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
            (article.notes || []).join("\n"),
          ],
        })),
      ),
    );
  }

  private save_pdf(content: Buffer, name: string) {
    fs.writeFileSync(path.join(this.asset_dir, name), content);
  }

  private remove_pdf(pdf_uri: string) {
    const asset_name = /^SOURCE: !\[(.*)\]\(\.\.\/assets\/(.*)\)$/.exec(
      pdf_uri,
    )[2];
    console.log("to remove asset: ", asset_name);
    const asset_path = path.join(this.asset_dir, asset_name);
    if (fs.existsSync(asset_path)) {
      fs.unlinkSync(asset_path);
    }
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
        notes: children[5]?.content?.slice(2).split("\n"),
      };
    });
  }
}
