import { ArticleService } from ".";

export class ArticleController {
    get_today() {
        return ArticleService.get_today_article();
    }

    refresh_summary() {
        return ArticleService.refresh_summary();
    }

    list() {
        return ArticleService.list_article();
    }
}
