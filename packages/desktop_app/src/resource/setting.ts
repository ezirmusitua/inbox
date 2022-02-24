import { InitSettingDto } from "@inbox/shared";
import { get, post, put } from "./fetch";

const setting = {
    get_setting() {
        return get({ url: "api/setting" });
    },

    init_setting(dto: InitSettingDto) {
        return post({ url: "api/setting", data: dto });
    },

    update_setting() {
        return put({ url: "api/setting", data: {} });
    },
};

export default setting;
