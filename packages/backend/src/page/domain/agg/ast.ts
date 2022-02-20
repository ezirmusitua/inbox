import { ArticleAST } from "article/domain/agg/ast";
import * as fs from "fs";
import { SettingEntity } from "setting/domain/agg/entity";
import { ASTree, iASTreeNode } from "utils/ast";

export class PageAST {
  static async get_data(content: string, setting: SettingEntity) {
    const ast_node = ASTree.parse(content);
    const articles = [];
    for (const line of ast_node[0].children) {
      const bi_link = line.children[0] as iASTreeNode;
      const article_title = bi_link.children[0].content;
      const article_path = setting.logseq_page_path(article_title);
      if (fs.existsSync(article_path)) {
        const file_content = (await new Promise((resolve) =>
          fs.readFile(article_path, (_, data) => resolve(data.toString())),
        )) as string;
        const article = ArticleAST.get_data(file_content);
        articles.push(article);
      }
    }
  }
}
