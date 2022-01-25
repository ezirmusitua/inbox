export interface iArticle {
    url: string;
    title: string;
    saved_at: Date;
}

export interface iStructuredContent {
    raw: string;
    content: string;
    children: iStructuredContent[];
}
