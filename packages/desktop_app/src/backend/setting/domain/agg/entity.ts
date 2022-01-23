import { fs, path } from "@tauri-apps/api";
import { iAppSetting } from "shared/setting";

export class SettingEntity {
    constructor(private readonly _data: iAppSetting) {}

    get logseq_root() {
        return this._data.logseq_root;
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
        const target = `${base}/.logseq_box`;
        try {
            await fs.readDir(target);
        } catch (e) {
            await fs.createDir(target);
        }
        return target;
    }

    static async get_setting_path() {
        const setting_root = await this.get_setting_root();
        const setting_path = `${setting_root}/setting.json`;
        return setting_path;
    }

    static async read_setting() {
        const setting_path = await this.get_setting_path();
        const content = await fs.readTextFile(setting_path);
        return new SettingEntity(JSON.parse(content));
    }
}
