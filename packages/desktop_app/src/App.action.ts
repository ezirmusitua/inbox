import { dialog } from "@tauri-apps/api";
import backend from "backend";
import { iAppContextValue } from "./App.store";

export default class AppAction {

    constructor(private readonly ctx: iAppContextValue) {}

    async init_app() {
        let backend_config = await backend.check_initialized();
        if (!backend_config) {
            // eslint-disable-next-line
            const yes = confirm("初次使用请先设置 logseq 库位置");
            if (!yes) {
                alert("请先设置 logseq 库位置");
                return;
            }
            const dto = await backend.prepare_initialization_dto();
            dto.logseq.root = (await dialog.open({
                directory: true,
            })) as string;
            backend_config = dto.backend;
        }
        await backend.start_backend(backend_config);
        // await backend.init_setting(dto);
    }

    async init() {
        await this.init_app();
        this.ctx.dispatch({ type: "set_initialized", payload: true });
    }
}
