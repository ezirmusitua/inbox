import { InitSettingDto } from "@inbox/shared";
import { Injectable } from "@nestjs/common";
import { SettingConfig } from "./config";
import { SettingEntity } from "./domain/agg/entity";

@Injectable()
export class SettingService {
  constructor(private readonly _config: SettingConfig) {}

  init_setting(dto: InitSettingDto) {
    const entity = new SettingEntity(dto);
    return entity.save_setting();
  }

  get_setting() {
    return SettingEntity.read_setting(this._config.setting_path);
  }

  update_setting() {
    return;
  }
}
