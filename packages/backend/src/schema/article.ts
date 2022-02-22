import { iArticle, iArticleClip } from "@inbox/shared";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { sBase } from "./base";
import { sArticleClip } from "./clip";
import { sPage } from "./page";

@Entity("article")
export class sArticle extends sBase implements iArticle {
  @Index()
  @Column({ unique: true })
  _url_hash: string;

  @Index()
  @Column({ unique: true })
  url: string;

  @Column()
  title: string;

  @Index()
  @Column()
  saved_at: Date;

  @Index()
  @Column({ nullable: true })
  page_id?: number;

  @Column({ nullable: true })
  pdf?: string;

  @ManyToOne(() => sPage, (page) => page.articles, { nullable: true })
  @JoinColumn({ name: "page_id" })
  page?: sPage;

  @OneToMany(() => sArticleClip, (clip) => clip.article, { nullable: true })
  clips?: iArticleClip[];
}
