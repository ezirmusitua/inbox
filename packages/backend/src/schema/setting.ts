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

@Entity("setting")
export class sSetting extends sBase implements iSetting {
  @Column({ type: "json" })
  app: iAppSetting;

  @Column({ type: "json" })
  logseq: iLogseqSetting;

  @Column({ type: "json" })
  backend: iBackendSetting;

  @Column({ type: "json" })
  device: iDeviceSetting;

  @Column({ type: "json" })
  service: iServiceSetting;
}
