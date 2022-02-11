import { article } from "../resource/article";
import { iTodayContextValue } from "./Today.store";

export default class TodayAction {
    constructor(private readonly ctx: iTodayContextValue) {}

    async init() {
        const { data } = await article.get_today();
        this.ctx.dispatch({
            type: "set_items",
            payload: [
                {
                    ...data,
                    items: data.items.map(({ saved_at, ...i }) => ({
                        ...i,
                        saved_at: new Date(saved_at),
                    })),
                },
            ],
        });
        this.ctx.dispatch({ type: "set_initialized", payload: true });
    }
}
