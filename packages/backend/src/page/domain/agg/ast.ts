import { iPage } from "@inbox/shared";
import { ArticleAST } from "article/domain/agg/ast";
import * as fs from "fs";
import { SettingEntity } from "setting/domain/agg/entity";
import { ASTree, eTokenType, iASTreeNode } from "utils/ast";

export class PageAST {
  constructor(private readonly _data: iPage) {}

  get ast_node() {
    return {
      type: eTokenType.ROOT,
      children: this._data.articles.map((article) => ({
        type: eTokenType.LINE,
        children: [
          {
            type: eTokenType.BI_LINK,
            children: [
              {
                type: eTokenType.TEXT,
                content: article.title,
              },
            ],
          },
        ],
      })),
    };
  }

  get string() {
    return ASTree.stringify(this.ast_node);
  }

  static async get_data(content: string, setting: SettingEntity) {
    if (!content) return [];
    const ast_node = ASTree.parse(content);
    const articles = [];
    for (const line of ast_node[0].children) {
      const bi_link = line.children[0] as iASTreeNode;
      const article_title = bi_link.content;
      const article_path = setting.logseq_page_path(`${article_title}.md`);
      if (fs.existsSync(article_path)) {
        const file_content = (await new Promise((resolve) =>
          fs.readFile(article_path, (_, data) => resolve(data.toString())),
        )) as string;
        const article = ArticleAST.get_data(file_content);
        articles.push(article);
      }
    }
    return articles;
  }
}
