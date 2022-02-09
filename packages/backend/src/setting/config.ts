import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface iConfig {
  setting_path: string;
}

@Injectable()
export class SettingConfig {
  constructor(private readonly _config: ConfigService<iConfig>) {}

  get setting_path() {
    return this._config.get("setting_path");
  }
}
