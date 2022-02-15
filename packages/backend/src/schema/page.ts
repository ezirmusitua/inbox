import { iPage } from "@inbox/shared";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { sArticle } from "./article";
import { sBase } from "./base";

@Entity("page")
export class sPage extends sBase implements iPage {
  @Index()
  @Column({ unique: true })
  title: string;

  @OneToMany(() => sArticle, (article) => article.page)
  articles: sArticle[];
}
