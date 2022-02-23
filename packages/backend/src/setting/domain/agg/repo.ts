import { iSetting } from "@inbox/shared";
import { Repository } from "typeorm";
import { read_file_silently } from "utils";
import { SettingEntity } from "./entity";

export class SettingAggRepo {
  constructor(
    private readonly setting_repo: Repository<iSetting>,
    private readonly setting_path: string,
  ) {}

  async save_setting(data: iSetting) {
    return this.setting_repo.save(data);
  }

  async get_entity(refresh = false) {
    let data: iSetting;
    if (!refresh) {
      data = await this.setting_repo.findOne();
    }
    if (!data) {
      const content = await read_file_silently(this.setting_path);
      data = JSON.parse(content);
    }
    return new SettingEntity(data, this);
  }
}
