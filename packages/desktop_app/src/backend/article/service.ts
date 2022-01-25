import { SettingService } from "backend/setting";
import { ArticleEntity } from "./domain/agg/entity";

export class ArticleService {
    static async get_today_article() {
        const setting = await SettingService.get_setting();
        const today_file_path = setting.today_path;
        const entity = await ArticleEntity.read_from_file(today_file_path);
        return { data: entity.article, status: 1 };
    }
}
