import {
  iAppSetting,
  iBackendSetting,
  iDeviceSetting,
  iLogseqSetting,
  iServiceSetting,
  iSetting,
} from "@inbox/shared";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateSettingDto implements iSetting {
  @ApiProperty({ name: "app" })
  app: iAppSetting;

  @ApiProperty({ name: "logseq" })
  logseq: iLogseqSetting;

  // TODO: should not change database setting
  @ApiProperty({ name: "backend" })
  backend: iBackendSetting;

  @ApiProperty({ name: "device" })
  device: iDeviceSetting;

  @ApiProperty({ name: "service" })
  service: iServiceSetting;
}
