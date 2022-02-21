import { iPage } from ".";
import { iBase } from "./base";
import { tPageId } from "./page";

export type tArticleId = number;
export type tArticleClipId = number;

export interface iArticleClip extends iBase {
    _id?: tArticleClipId;
    content: string;
    note?: string;
    article?: iArticle;
}

export interface iArticleBasic {
    url: string;
    title: string;
}

export interface iArticle extends iBase, iArticleBasic {
    _id?: tArticleId;
    url_hash?: string;
    page?: iPage;
    pdf?: string;
    clips?: iArticleClip[];
    saved_at?: Date;
}
