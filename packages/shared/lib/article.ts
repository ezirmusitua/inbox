export interface iArticle {
    url: string;
    title: string;
    content?: string;
    pdf?: string;
    saved_at: Date;
}

export interface iStructuredContent {
    raw: string;
    content: string;
    children: iStructuredContent[];
}
