import { iArticle } from "@inbox/shared";
import * as fs from "fs";
import { SettingEntity } from "setting/domain/agg/entity";
import { clean_file_path } from "utils";
import { ArticleAST } from "./ast";
import { Clip } from "./clip";
import { Pdf } from "./pdf";
import { ArticleAggRepo } from "./repo";

export class ArticleEntity {
  private ast = new ArticleAST(this._data);
  constructor(
    private _data: iArticle,
    private _setting: SettingEntity,
    private repo: ArticleAggRepo,
  ) {}

  get data() {
    return this._data;
  }

  get cleaned_name() {
    return clean_file_path(this._data.title);
  }

  get pdf_name() {
    return `${this.cleaned_name}.pdf`;
  }

  get pdf_path() {
    return this._setting.logseq_asset_path(this.pdf_name);
  }

  get filename() {
    return `${this.cleaned_name}.md`;
  }

  get filepath() {
    return this._setting.logseq_page_path(this.filename);
  }

  async save(content: string) {
    await this.save_pdf(content);
    await this.repo.save_article(this._data);
    return new Promise((resolve, reject) =>
      fs.writeFile(this.filepath, this.ast.string, (err) => {
        if (err) return reject(err);
        return resolve(true);
      }),
    );
  }

  async save_pdf(content: string) {
    if (!content || this._data.pdf) return;
    const pdf = new Pdf(content);
    const buffer = await pdf.generate();
    this._data.pdf = `../assets/${this.pdf_name}`;
    return new Promise((resolve, reject) =>
      fs.writeFile(this.pdf_path, buffer, (err) => {
        if (err) return reject(err);
        return resolve(true);
      }),
    );
  }

  async remove() {
    await this.remove_pdf();
    if (!fs.existsSync(this.filepath)) return;
    return new Promise((resolve, reject) =>
      fs.unlink(this.filepath, (err) => {
        if (err) return reject(err);
        return resolve(true);
      }),
    );
  }

  private remove_pdf() {
    if (!fs.existsSync(this.pdf_path)) return;
    return new Promise((resolve, reject) =>
      fs.unlink(this.pdf_path, (err) => {
        if (err) return reject(err);
        return resolve(true);
      }),
    );
  }

  async make_clip(selection: string) {
    const clip = await Clip.create(selection, this._data, this.repo);
    this._data.clips.push(clip.data);
    return this.save("");
  }
}
