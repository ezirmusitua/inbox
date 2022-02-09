import { get, put } from "./fetch";

export const article = {
    refresh_summary() {
        return put({ url: "api/article/summary", data: {} });
    },
    get_today() {
        return get({ url: "api/article/today" });
    },
};
