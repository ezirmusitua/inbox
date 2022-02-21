import { iArticle, iPage } from "@inbox/shared";
import { NotFoundException } from "@nestjs/common";
import * as fs from "fs";
import { cwd } from "process";
import { SettingEntity } from "setting/domain/agg/entity";
import { In, Not, Repository } from "typeorm";
import { PageAST } from "./ast";
import { PageEntity } from "./entity";

export class PageAggRepo {
  constructor(
    private readonly _page_repo: Repository<iPage>,
    private readonly _article_repo: Repository<iArticle>,
  ) {}

  save_article(article: iArticle) {
    return this._article_repo.save(article);
  }

  save_page(page: iPage) {
    return this._page_repo.save(page);
  }

  remove_pages(page_ids: number[]) {
    return this._page_repo.delete({ _id: Not(In(page_ids)) });
  }

  async get_page_entity(title: string, setting: SettingEntity) {
    let data = await this._page_repo.findOne({ title });
    if (data) {
      data = {
        _id: null,
        title: title,
        articles: [],
      };
    }
    return new PageEntity(data, setting, this);
  }

  static async sync_local_pages(setting: SettingEntity) {
    const page_files: Array<{ name: string; path: string }> = await new Promise(
      (resolve, reject) =>
        fs.readdir(setting.logseq_page_dir, (err, files) => {
          if (err) return reject(err);
          return resolve(
            files
              .filter((file) => file.endsWith("-信息列表.md"))
              .map((name) => ({
                name,
                path: setting.logseq_page_path(name),
              })),
          );
        }),
    );
    const pages: iPage[] = [];
    for (const page_file of page_files) {
      const page_data = await PageAggRepo.get_page_data_from_file(
        page_file.name,
        setting,
      );
      pages.push(page_data);
    }
    return pages;
  }

  static async parse_articles_from_file(
    full_path: string,
    setting: SettingEntity,
  ) {
    if (!fs.existsSync(full_path)) {
      throw new NotFoundException(`${full_path} not found`);
    }
    const content: string = await new Promise((resolve) =>
      fs.readFile(full_path, (_, data) => resolve(data.toString())),
    );
    return PageAST.get_data(content, setting);
  }

  static async get_page_data_from_file(
    page_name: string,
    setting: SettingEntity,
  ) {
    const articles = await PageAggRepo.parse_articles_from_file(
      setting.logseq_page_path(page_name),
      setting,
    );
    return {
      _id: null,
      title: page_name.replace(".md", ""),
      articles,
    };
  }
}
