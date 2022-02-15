import { iBase } from "./base";

export interface iBackendSetting {
    port: string;
    host: string;
    db_type: string;
    db_database: string;
    jwt_secret: string;
    jwt_expires: string;
    browser_bin: string;
}

export interface iLogseqSetting {
    root: string;
}

export interface iAppSetting {
    name: string;
}

export interface iDeviceSetting {
    document_dir: string;
    user_dir: string;
}

export interface iServiceSetting {
    [key: string]: {
        name: string;
        params: Record<string, any>;
    };
}

export interface iSetting extends iBase {
    app: iAppSetting;
    logseq: iLogseqSetting;
    backend: iBackendSetting;
    device: iDeviceSetting;
    service: iServiceSetting;
}
