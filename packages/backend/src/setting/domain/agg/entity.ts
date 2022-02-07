import * as fs from "fs";
import * as path from "path";
import { iAppSetting } from "@inbox/shared";

export class SettingEntity {
  constructor(private readonly _data: iAppSetting) {}

  get logseq_root() {
    return this._data.logseq.root;
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
    const root = this.logseq_root;
    return fs
      .readdirSync(root)
      .filter((f) => f.endsWith("信息列表.md"))
      .map((f) => path.join(root, f));
  }

  update_setting(setting: iAppSetting) {
    this._data.logseq = setting.logseq;
    this._data.backend = setting.backend;
    this._data.app = setting.app;
    this._data.device = setting.device;
    this._data._update_at = new Date();
    this._data._version = (this._data._version || 0) + 1;
  }

  async save_setting() {
    const setting_path = await SettingEntity.get_setting_path();
    return fs.writeFileSync(setting_path, JSON.stringify(this._data, null, 2));
  }

  static async get_setting_root() {
    // TODO: decide by OS or get from desktop application
    const base = "/Users/jz/Documents";
    const target = `${base}${path.sep}.logseq_box`;
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target);
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
    const content = fs.readFileSync(setting_path).toString();
    return new SettingEntity(JSON.parse(content));
  }
}
