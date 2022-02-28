import {
  InitSettingDto,
  UpdateBackendSettingDto,
  UpdateLogseqSettingDto,
} from "@inbox/shared";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { sSetting } from "schema/setting";
import { Repository } from "typeorm";
import { SettingConfig } from "./config";
import { SettingEntity } from "./domain/agg/entity";
import { SettingAggRepo } from "./domain/agg/repo";
import { UpdateSettingDto } from "./dto";

@Injectable()
export class SettingService implements OnApplicationBootstrap {
  private readonly _agg_repo = new SettingAggRepo(
    this.setting_repo,
    this._config.setting_path,
  );

  constructor(
    private readonly _config: SettingConfig,
    @InjectRepository(sSetting)
    private readonly setting_repo: Repository<sSetting>,
  ) {}

  async onApplicationBootstrap() {
    const entity = await this._agg_repo.get_entity(true);
    await entity.save_setting();
  }

  async init_setting(dto: InitSettingDto) {
    const entity = new SettingEntity(dto, this._agg_repo);
    await entity.init_setting();
    return { status: 1 };
  }

  async update_backend_setting(dto: UpdateBackendSettingDto) {
    const entity = await this._agg_repo.get_entity();
    await entity.update_backend_setting(dto);
    return { status: 1 };
  }

  async update_logseq_setting(dto: UpdateLogseqSettingDto) {
    const entity = await this._agg_repo.get_entity();
    await entity.update_logseq_setting(dto);
    return { status: 1 };
  }

  get_setting() {
    return this._agg_repo.get_entity();
  }
}
