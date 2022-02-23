import {
  iAppSetting,
  iBackendSetting,
  iDeviceSetting,
  iLogseqSetting,
  iServiceSetting,
  iSetting,
} from "@inbox/shared";
import { Column, Entity, ValueTransformer } from "typeorm";
import { sBase } from "./base";

class JSONTransformer implements ValueTransformer {
  to(value: Record<string, any>) {
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value);
    } catch (e) {
      console.error(e);
      return {};
    }
  }
  from(value: string) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.log("from: ", value, e);
      return "{}";
    }
  }
}

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
