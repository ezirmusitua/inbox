import { InitSettingDto } from "@inbox/shared";

export const setting = {
    check_initialized() {
        return { data: null };
    },
    init_setting(dto: InitSettingDto) {},
};
export const article = {
    refresh_summary() {
        return { data: null };
    },
    get_today() {
        return { data: { items: [] } };
    },
};
