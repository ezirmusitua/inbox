import { iArticle, iArticleClip } from "@inbox/shared";
import { SettingEntity } from "setting/domain/agg/entity";
import { In, Not, Repository } from "typeorm";
import { hash } from "utils";
import { ArticleEntity } from "./entity";

export class ArticleAggRepo {
  constructor(
    private readonly _article_repo: Repository<iArticle>,
    private readonly _clip_repo: Repository<iArticleClip>,
  ) {}

  async ensure_entity(payload: iArticle, setting: SettingEntity) {
    const data: iArticle = await this._article_repo.findOne({
      where: [{ _id: payload._id }, { _url_hash: hash(payload.url) }],
    });
    return new ArticleEntity(
      data || { ...payload, saved_at: new Date() },
      setting,
      this,
    );
  }

  async get_entity(id: number, setting: SettingEntity) {
    const data = await this._article_repo.findOne(id);
    return new ArticleEntity(data, setting, this);
  }

  list() {
    return this._article_repo.find();
  }

  save_article(data: iArticle) {
    return this._article_repo.save(data);
  }

  save_clip(data: iArticleClip) {
    return this._clip_repo.save(data);
  }

  remove_articles(article_ids: number[]) {
    return this._article_repo.delete({ _id: Not(In(article_ids)) });
  }

  remove_article_clips(clip_ids: number[]) {
    return this._clip_repo.delete({ _id: Not(In(clip_ids)) });
  }
}
