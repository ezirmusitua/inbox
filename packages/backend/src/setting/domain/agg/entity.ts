import * as fs from "fs";
import * as path from "path";
import { iAppSetting } from "@inbox/shared";

export class SettingEntity {
  constructor(private readonly _data: iAppSetting) {}

  get setting_dir() {
    return path.join(this._data.device.document_dir, `.${this._data.app.name}`);
  }

  get setting_path() {
    return path.join(this.setting_dir, `settings.json`);
  }

  get logseq_dir_path() {
    return this._data.logseq.root;
  }

  get logseq_page_dir_path() {
    return path.join(this._data.logseq.root, "pages");
  }

  get logseq_asset_dir_path() {
    return path.join(this._data.logseq.root, "assets");
  }

  get today_article_path() {
    const now = new Date();
    return this.concat_day_path(now);
  }

  get article_summary_path() {
    return path.join(this.logseq_page_dir_path, "汇总信息列表.md");
  }

  get all_article_path() {
    return fs
      .readdirSync(this.logseq_page_dir_path)
      .filter((f) => f.endsWith("信息列表.md"))
      .map((f) => path.join(this.logseq_page_dir_path, f));
  }

  get browser_path() {
    return this._data.backend.browser_bin;
  }

  update_setting(setting: iAppSetting) {
    this._data.logseq = setting.logseq;
    this._data.backend = setting.backend;
    this._data.app = setting.app;
    this._data.device = setting.device;
    this._data._update_at = new Date();
    this._data._version = (this._data._version || 0) + 1;
  }

  init_setting() {
    this.ensure_setting_dir();
    this.save_backend_config();
    this.save_setting();
  }

  save_setting() {
    return fs.writeFileSync(
      this.setting_path,
      JSON.stringify(this._data, null, 2),
    );
  }

  ensure_setting_dir() {
    if (!fs.existsSync(this.setting_dir)) {
      fs.mkdirSync(this.setting_dir);
    }
  }

  save_backend_config() {
    const app_config_dir = `${this._data.device.user_dir}.${this._data.app.name}`;
    const backend_config_path = `${app_config_dir}${path.sep}backend.json`;
    return fs.writeFileSync(
      backend_config_path,
      JSON.stringify(this._data.backend, null, 2),
    );
  }

  private concat_day_path(dt: Date) {
    const year_str = dt.getFullYear() + "";
    const month = dt.getMonth() + 1;
    const month_str = month < 10 ? "0" + month : month + "";
    const day = dt.getDate();
    const day_str = day < 10 ? "0" + day : day + "";
    return path.join(
      this.logseq_page_dir_path,
      `${year_str}_${month_str}_${day_str}-信息列表.md`,
    );
  }

  static read_setting(setting_path: string) {
    const content = fs.readFileSync(setting_path).toString();
    return new SettingEntity(JSON.parse(content));
  }
}
