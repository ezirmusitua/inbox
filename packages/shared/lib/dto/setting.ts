import {
    iAppSetting,
    iBackendSetting,
    iDeviceSetting,
    iLogseqSetting,
    iServiceSetting,
    iSetting,
} from "../schema";

export class InitSettingDto implements iSetting {
    public readonly app: iAppSetting;
    public readonly logseq: iLogseqSetting;
    public readonly backend: iBackendSetting;
    public readonly device: iDeviceSetting;
    public readonly service: iServiceSetting;
}
