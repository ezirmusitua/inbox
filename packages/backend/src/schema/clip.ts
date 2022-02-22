import { iArticleClip } from "@inbox/shared";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { sArticle } from "./article";
import { sBase } from "./base";

@Entity("article_clip")
export class sArticleClip extends sBase implements iArticleClip {
  @Column()
  content: string;

  @Column({ default: "[]" })
  note?: string;

  @Index()
  @Column({ nullable: true })
  article_id?: number;

  @ManyToOne(() => sArticle, (article) => article.clips)
  @JoinColumn({ name: "article_id" })
  article?: sArticle;
}
