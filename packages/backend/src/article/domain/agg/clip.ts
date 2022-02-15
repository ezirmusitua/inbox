import { iArticle, iArticleClip } from "@inbox/shared";
import { ArticleAggRepo } from "./repo";

export class Clip {
  constructor(
    private clip: iArticleClip,
    private readonly _repo: ArticleAggRepo,
  ) {}

  set article(article: iArticle) {
    this.clip.article = article;
  }

  get data() {
    return this.clip;
  }

  async save() {
    await this._repo.save_clip(this.clip);
    return this;
  }

  static create(content: string, article: iArticle, repo: ArticleAggRepo) {
    return new Clip({ content, article }, repo).save();
  }
}
