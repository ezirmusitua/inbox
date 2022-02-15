import { iArticle } from "@inbox/shared";
import { PageAggRepo } from "./repo";

export class PageArticleList {
  constructor(private _data: iArticle[], private readonly repo: PageAggRepo) {}

  get(id: number) {
    return this._data.find(({ _id }) => id === _id);
  }

  async add(article: iArticle) {
    this._data = [
      article,
      ...this._data.filter(({ _id }) => _id !== article._id),
    ];
    return this;
  }

  async remove(article: iArticle) {
    this._data = this._data.filter(({ _id }) => _id !== article._id);
    return this;
  }
}
