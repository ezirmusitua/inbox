import article from "../../resource/article";
import { eActionType, iContextValue } from "./context";

export async function init(ctx: iContextValue) {
    const { data } = await article.get_today();
    this.ctx.dispatch({
        type: eActionType.CHANGE_ITEMS,
        payload: data.items.map(({ saved_at, ...i }) => ({
            ...i,
            saved_at: new Date(saved_at),
        })),
    });
    this.ctx.dispatch({
        type: eActionType.CHANGE_INITIALIZED,
        payload: true,
    });
}
