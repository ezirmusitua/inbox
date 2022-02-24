import article from "resource/article";
import { eActionType, iContextValue } from "./context";

export async function init(ctx: iContextValue) {
    const resp = await article.list();
    ctx.dispatch({
        type: eActionType.CHANGE_ITEMS,
        payload: resp.data.items,
    });
    ctx.dispatch({
        type: eActionType.CHANGE_INITIALIZED,
        payload: true,
    });
}
