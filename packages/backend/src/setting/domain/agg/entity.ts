import * as path from "path";
import { iSetting } from "@inbox/shared";
import { ensure_dir, read_file_silently, save_file } from "utils";

export class SettingEntity {
  constructor(private readonly _data: iSetting) {}

  get setting_dir() {
    return path.join(this._data.device.document_dir, `.${this._data.app.name}`);
  }

  get logseq_page_dir() {
    return path.join(this._data.logseq.root, "pages");
  }

  get setting_path() {
    return path.join(this.setting_dir, `settings.json`);
  }

  logseq_page_path(target: string) {
    return path.join(this.logseq_page_dir, target);
  }

  logseq_asset_path(target: string) {
    return path.join(this._data.logseq.root, "assets", target);
  }

  logseq_journal_path(target: string) {
    return path.join(this._data.logseq.root, "journals", target);
  }

  get browser_path() {
    return this._data.backend.browser_bin;
  }

  update_setting(setting: iSetting) {
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
    return save_file(JSON.stringify(this._data, null, 2), this.setting_path);
  }

  ensure_setting_dir() {
    ensure_dir(this.setting_dir);
  }

  save_backend_config() {
    const app_config_dir = `${this._data.device.user_dir}.${this._data.app.name}`;
    const backend_config_path = `${app_config_dir}${path.sep}backend.json`;
    return save_file(
      JSON.stringify(this._data.backend, null, 2),
      backend_config_path,
    );
  }

  static async read_setting(setting_path: string) {
    const content = await read_file_silently(setting_path);
    return new SettingEntity(JSON.parse(content));
  }
}
