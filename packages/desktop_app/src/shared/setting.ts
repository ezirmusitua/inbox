export interface iAppSetting {
    logseq_root: string;
    _version?: number;
    _update_at?: Date;
    _created_at?: Date;
}

export class InitSettingDto {
    constructor(public readonly logseq_root: string) {}
}
