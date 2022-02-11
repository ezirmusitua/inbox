export interface iArticlePayload {
    url: string;
    title: string;
    content?: string;
}

export interface iArticle extends iArticlePayload {
    _url_hash?: string;
    _day_file?: string;
    pdf?: string;
    saved_at: Date;
}

export interface iStructuredContent {
    raw: string;
    content: string;
    children: iStructuredContent[];
}
