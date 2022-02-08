import { article } from "../resource/article";
import { iArticleContextValue } from "./Article.store";

export default class ArticleAction {
    constructor(private readonly ctx: iArticleContextValue) {}

    async init() {
        // TODO: add init today api, create if not exist
        const resp = await article.refresh_summary();
        this.ctx.dispatch({
            type: "set_items",
            payload: resp.data.items,
        });
        this.ctx.dispatch({ type: "set_initialized", payload: true });
    }
}
