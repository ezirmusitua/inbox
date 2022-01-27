import { fs, path } from "@tauri-apps/api";
import { iAppSetting } from "shared/setting";

export class SettingEntity {
    constructor(private readonly _data: iAppSetting) {}

    get logseq_root() {
        return this._data.logseq_root;
    }

    concat_day_path(dt: Date) {
        const year_str = dt.getFullYear() + "";
        const month = dt.getMonth() + 1;
        const month_str = month < 10 ? "0" + month : month + "";
        const day = dt.getDate();
        const day_str = day < 10 ? "0" + day : day + "";
        return `${this.logseq_root}${path.sep}${year_str}_${month_str}_${day_str}-信息列表.md`;
    }

    get today_path() {
        const now = new Date();
        return this.concat_day_path(now);
    }

    get summary_path() {
        return `${this.logseq_root}${path.sep}汇总信息列表.md`;
    }

    async get_all_path() {
        const file = await fs.readDir(this.logseq_root);
        const article_file = file.filter(
            (f) => !f.children && f.name && f.name.endsWith("信息列表.md"),
        );
        return article_file.map((f) => f.path);
    }

    update_setting(setting: iAppSetting) {
        this._data.logseq_root = setting.logseq_root;
        this._data._update_at = new Date();
        this._data._version = (this._data._version || 0) + 1;
    }

    async save_setting() {
        const setting_path = await SettingEntity.get_setting_path();
        await fs.writeFile({
            path: setting_path,
            contents: JSON.stringify(this._data, null, 2),
        });
    }

    static async get_setting_root() {
        const base = await path.documentDir();
        const target = `${base}${path.sep}.logseq_box`;
        try {
            await fs.readDir(target);
        } catch (e) {
            await fs.createDir(target);
        }
        return target;
    }

    static async get_setting_path() {
        const setting_root = await this.get_setting_root();
        const setting_path = `${setting_root}${path.sep}setting.json`;
        return setting_path;
    }

    static async read_setting() {
        const setting_path = await this.get_setting_path();
        const content = await fs.readTextFile(setting_path);
        return new SettingEntity(JSON.parse(content));
    }
}
