import { del, get } from "./fetch";

const article = {
    list() {
        return get({ url: "api/article" });
    },

    get_today() {
        return get({ url: "api/article/today" });
    },

    remove_article(_url_hash: string) {
        return del({ url: `api/article/:_url_hash`, params: { _url_hash } });
    },
};

export default article;
