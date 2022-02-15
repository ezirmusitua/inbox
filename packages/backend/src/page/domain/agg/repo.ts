import { iArticle, iPage } from "@inbox/shared";
import { sArticle } from "schema/article";
import { sPage } from "schema/page";
import { Repository } from "typeorm";

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
}
