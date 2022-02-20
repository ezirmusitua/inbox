import { iArticle } from "@inbox/shared";
import { DateTime } from "luxon";
import { ASTree, eTokenType, iASTreeNode } from "utils/ast";

export class ArticleAST {
  constructor(private readonly _data: iArticle) {}

  get tags() {
    return {
      type: eTokenType.LINE,
      children: [
        { field: "title", value: this._data.title },
        { field: "url", value: this._data.url },
        {
          field: "saved_at",
          value: DateTime.fromJSDate(this._data.saved_at).toFormat(
            "yyyy-mm-dd HH:MM",
          ),
        },
      ].map(({ field, value }) => ({
        type: eTokenType.TAG,
        children: [
          {
            type: eTokenType.TEXT,
            children: [],
            content: field,
          },
          {
            type: eTokenType.TEXT,
            children: [],
            content: field,
          },
        ],
      })),
    } as iASTreeNode;
  }

  get source() {
    return {
      type: eTokenType.LINE,
      children: [
        {
          type: eTokenType.TEXT,
          content: "SOURCE: ",
          children: [],
        },
        {
          type: eTokenType.ASSET,
          children: [
            {
              type: eTokenType.TEXT,
              children: [],
              content: this._data.title,
            },
            {
              type: eTokenType.TEXT,
              children: [],
              content: this._data.pdf,
            },
          ],
        },
      ],
    } as iASTreeNode;
  }

  get clips() {
    return {
      type: eTokenType.LINE,
      children: [
        {
          type: eTokenType.TEXT,
          children: [],
          content: "CLIPS",
        },
        ...this._data.clips.map(({ content, note }) => ({
          type: eTokenType.LINE,
          children: [
            {
              type: eTokenType.QUOTE,
              children: [
                {
                  type: eTokenType.TEXT,
                  children: [],
                  content: content,
                },
              ],
            },
            ...note.map((text) => ({
              type: eTokenType.LINE,
              children: [
                {
                  type: eTokenType.TEXT,
                  children: [],
                  content: text,
                },
              ],
            })),
          ],
        })),
      ],
    } as iASTreeNode;
  }

  get ast_node() {
    return {
      type: eTokenType.ROOT,
      children: [this.tags, this.source, this.clips],
    };
  }

  get string() {
    return ASTree.stringify(this.ast_node);
  }

  static get_data(content: string) {
    const article_node = ASTree.parse(content)[0] as iASTreeNode;
    return {
      title: article_node.children[0].children[0].content,
      url: article_node.children[0].children[1].content,
      saved_at: DateTime.fromFormat(
        article_node.children[0].children[2].content,
        "yyyy-mm-dd HH:MM",
      ),
      pdf: article_node.children[1].children[1].children[1].content,
      clips: article_node.children[2].children.slice(1).map((quote) => ({
        content: quote.children[0].content,
        note: quote.children.slice(1).map((line) => line.children[0].content),
      })),
    };
  }
}
