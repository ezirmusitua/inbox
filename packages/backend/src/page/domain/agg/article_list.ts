import { iArticle, iPage } from "@inbox/shared";
import { PageAggRepo } from "./repo";

export class PageArticleList {
  private _data = this.page.articles;
  constructor(
    private readonly page: iPage,
    private readonly repo: PageAggRepo,
  ) {}

  get(id: number) {
    return this._data.find(({ _id }) => id === _id);
  }

  get data() {
    return this._data;
  }

  async add(article: iArticle) {
    const updated = await this.repo.save_article({
      ...article,
      page: this.page,
      page_id: this.page._id,
    });
    this._data = [
      updated,
      ...this._data.filter(({ _id }) => _id !== article._id),
    ];
    return this;
  }

  async remove(article: iArticle) {
    this._data = this._data.filter(({ _id }) => _id !== article._id);
    return this;
  }
}
