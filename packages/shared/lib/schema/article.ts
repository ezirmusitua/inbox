import { iPage } from ".";
import { iBase } from "./base";
import { tPageId } from "./page";

export type tArticleId = number;
export type tArticleClipId = number;

export interface iArticleClip extends iBase {
    _id?: tArticleClipId;
    content: string;
    note?: string[];
    article_id?: tArticleId;
    article?: iArticle;
}

export interface iArticleBasic {
    url: string;
    title: string;
}

export interface iArticle extends iBase, iArticleBasic {
    _id?: tArticleId;
    _url_hash?: string;
    page_id?: number;
    page?: iPage;
    pdf?: string;
    clips?: iArticleClip[];
    saved_at?: Date;
}
