import { fs } from "@tauri-apps/api";
import { parse_indent } from "backend/_utils";
import { iArticle, iStructuredContent } from "shared/article";

export class ArticleEntity {
    constructor(private readonly _data: iArticle[]) {}

    get article() {
        return this._data;
    }

    static async read_from_file(path: string) {
        try {
            const content = await fs.readTextFile(path);
            const structured = parse_indent(content);
            return new ArticleEntity(
                ArticleEntity.convert_to_article(structured),
            );
        } catch (e) {
            return new ArticleEntity([]);
        }
    }

    static convert_to_article(structured: iStructuredContent) {
        return structured.children.map(({ content, children }) => {
            return {
                title: content.slice(2),
                url: children[0].content.slice(2),
                saved_at: new Date(children[1].content.slice(2)),
            };
        });
    }
}
