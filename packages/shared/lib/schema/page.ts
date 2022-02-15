import { iArticle } from ".";
import { iBase } from "./base";

export type tPageId = number;

export interface iPage extends iBase {
    _id: tPageId;
    title: string;
    articles: iArticle[];
}
