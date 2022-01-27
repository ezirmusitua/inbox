import { article } from "../resource";
import { iTodayContextValue } from "./Today.store";

export default class TodayAction {
    constructor(private readonly ctx: iTodayContextValue) {}

    async init() {
        // TODO: add init today api, create if not exist
        const resp = await article.get_today();
        this.ctx.dispatch({
            type: "set_items",
            payload: [resp.data],
        });
        this.ctx.dispatch({ type: "set_initialized", payload: true });
    }
}
