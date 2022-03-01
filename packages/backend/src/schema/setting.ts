import {
  iAppSetting,
  iBackendSetting,
  iDeviceSetting,
  iLogseqSetting,
  iServiceSetting,
  iSetting,
} from "@inbox/shared";
import { Column, Entity } from "typeorm";
import { sBase } from "./base";
import { JSONTransformer } from "./_transformer";

@Entity("setting")
export class sSetting extends sBase implements iSetting {
  @Column({ type: "varchar", transformer: new JSONTransformer() })
  app: iAppSetting;

  @Column({ type: "varchar", transformer: new JSONTransformer() })
  logseq: iLogseqSetting;

  @Column({ type: "varchar", transformer: new JSONTransformer() })
  backend: iBackendSetting;

  @Column({ type: "varchar", transformer: new JSONTransformer() })
  device: iDeviceSetting;

  @Column({
    type: "varchar",
    transformer: new JSONTransformer(),
    nullable: true,
    default: "{}",
  })
  service: iServiceSetting;
}
