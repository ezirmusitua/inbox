import { InitSettingDto } from "@inbox/shared";
import { Injectable } from "@nestjs/common";
import { SettingEntity } from "./domain/agg/entity";

@Injectable()
export class SettingService {
  init_setting(dto: InitSettingDto) {
    console.log(dto);
    const entity = new SettingEntity(dto);
    return entity.save_setting();
  }

  async get_setting() {
    return SettingEntity.read_setting();
  }

  update_setting() {
    return;
  }
}
