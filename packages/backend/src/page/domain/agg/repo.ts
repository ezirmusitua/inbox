import * as fs from "fs";
import { iArticle, iPage } from "@inbox/shared";
import { sArticle } from "schema/article";
import { sPage } from "schema/page";
import { In, Not, Repository } from "typeorm";
import { parse_indent } from "utils";
import { PageEntity } from "./entity";
import { SettingEntity } from "setting/domain/agg/entity";
import { NotFoundError } from "rxjs";
import { NotFoundException } from "@nestjs/common";
import { ASTree } from "utils/ast";

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

  // TODO: move to repo
  async get_entity_from_file(name: string, setting: SettingEntity) {
    const full_path = setting.logseq_page_path(name);
    if (fs.existsSync(full_path)) {
      throw new NotFoundException(`${name} not found`);
    }
    const content: string = await new Promise((resolve) =>
      fs.readFile(full_path, (_, data) => resolve(data.toString())),
    );
    const ast_node = ASTree.parse(content);
    return PageEntity.from_ast(ast_node, setting);
  }
}
