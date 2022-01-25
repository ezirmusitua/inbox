import { ArticleService } from ".";

export class ArticleController {
    get_today() {
        return ArticleService.get_today_article();
    }
}
