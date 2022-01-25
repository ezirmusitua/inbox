import { dialog } from "@tauri-apps/api";
import { InitSettingDto } from "shared/setting";
import { iAppContextValue } from "./App.store";
import { article, setting } from "./resource";

export default class AppAction {
    constructor(private readonly ctx: iAppContextValue) {}

    async init_app() {
        const resp = await setting.check_initialized();
        if (resp.data) return;
        // eslint-disable-next-line
        const yes = confirm("初次使用请先设置 logseq 库位置");
        if (!yes) {
            alert("请先设置 logseq 库位置");
            return;
        }
        const dir_path = await dialog.open({ directory: true });
        await setting.init_setting(new InitSettingDto(dir_path as string));
    }

    async init_today() {
        // TODO: add init today api, create if not exist
        const resp = await article.get_today();
        console.log(resp);
    }

    async init() {
        await this.init_app();
        await this.init_today();
        this.ctx.dispatch({ type: "set_initialized", payload: true });
    }
}
