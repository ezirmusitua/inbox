import { iArticle } from "@inbox/shared";
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
  url_hash: string;

  @Index()
  @Column()
  page_id: number;

  @Column()
  pdf: string;

  @Column()
  url: string;

  @Column()
  title: string;

  @Column()
  content?: string;

  @Index()
  @Column()
  saved_at: Date;

  @ManyToOne(() => sPage, (page) => page.articles)
  @JoinColumn({ name: "page_id" })
  page: sPage;

  @OneToMany(() => sArticleClip, (clip) => clip.article)
  clips: [];
}
