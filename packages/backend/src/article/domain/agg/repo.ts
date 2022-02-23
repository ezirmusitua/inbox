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
    const _url_hash = hash(payload.url);
    let data: iArticle = await this._article_repo.findOne({
      where: [{ _id: payload._id }, { _url_hash }],
      relations: ["clips"],
    });
    if (!data) {
      data = await this._article_repo.save({
        ...payload,
        _url_hash,
        saved_at: new Date(),
      });
      data.clips = [];
    }
    return new ArticleEntity(data, setting, this);
  }

  async get_entity(id: number, setting: SettingEntity) {
    const data = await this._article_repo.findOne({
      where: { _id: id },
      relations: ["clips"],
    });
    return new ArticleEntity(data, setting, this);
  }

  list() {
    return this._article_repo.find();
  }

  async save_article(data: iArticle) {
    await this._clip_repo.save(data.clips);
    return this._article_repo.save(data);
  }

  async remove_article(data: iArticle) {
    await this._clip_repo.delete({ article_id: data._id });
    return this._article_repo.delete(data._id);
  }

  save_clip(data: iArticleClip) {
    return this._clip_repo.save(data);
  }

  async remove_articles(article_ids: number[]) {
    await this._clip_repo.delete({ article_id: In(article_ids) });
    return this._article_repo.delete({ _id: In(article_ids) });
  }

  async drop_article_database() {
    await this._clip_repo.delete({});
    return this._article_repo.delete({});
  }
}
