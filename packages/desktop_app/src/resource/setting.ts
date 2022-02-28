import {
    InitSettingDto,
    UpdateBackendSettingDto,
    UpdateLogseqSettingDto,
} from "@inbox/shared";
import { get, post, put } from "./fetch";

const setting = {
    get_setting() {
        return get({ url: "api/setting" });
    },

    init_setting(dto: InitSettingDto) {
        return post({ url: "api/setting", data: dto });
    },

    update_backend_setting(dto: UpdateBackendSettingDto) {
        return put({ url: "api/setting/backend", data: dto });
    },

    update_logseq_setting(dto: UpdateLogseqSettingDto) {
        return put({ url: "api/setting/logseq", data: dto });
    },
};

export default setting;
