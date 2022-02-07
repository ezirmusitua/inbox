export interface iBackendConfig {
    port: string;
    host: string;
    db_type: string;
    db_database: string;
    jwt_secret: string;
    jwt_expires: string;
}

export interface iLogseqConfig {
    root: string;
}

export interface iAppConfig {
    name: string;
}

export interface iDeviceConfig {
    document_dir: string;
    user_dir: string;
}

export interface iAppSetting {
    app: iAppConfig;
    logseq: iLogseqConfig;
    backend: iBackendConfig;
    device: iDeviceConfig;
    _version?: number;
    _update_at?: Date;
    _created_at?: Date;
}

export class InitSettingDto implements iAppSetting {
    public readonly app: iAppConfig;
    public readonly logseq: iLogseqConfig;
    public readonly backend: iBackendConfig;
    public readonly device: iDeviceConfig;
}
