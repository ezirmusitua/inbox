import { article } from "../resource/article";
import { eActionType, iArticleContextValue } from "./Article.store";

export default class ArticleAction {
    constructor(private readonly ctx: iArticleContextValue) {}

    async init() {
        const resp = await article.list();
        this.ctx.dispatch({
            type: eActionType.CHANGE_ITEMS,
            payload: resp.data.items,
        });
        this.ctx.dispatch({
            type: eActionType.CHANGE_INITIALIZED,
            payload: true,
        });
    }
}
