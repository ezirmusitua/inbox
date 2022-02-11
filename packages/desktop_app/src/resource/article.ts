import { del, get, put } from "./fetch";

export const article = {
    refresh_summary() {
        return put({ url: "api/article/summary", data: {} });
    },

    get_today() {
        return get({ url: "api/article/today" });
    },

    remove_article(_url_hash: string) {
        return del({ url: `api/article/:_url_hash`, params: { _url_hash } });
    },
};
