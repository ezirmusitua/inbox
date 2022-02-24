import setting from "resource/setting";
import { eActionType, iContextValue } from "./context";

export class SettingAction {
    constructor(private readonly ctx: iContextValue) {}

    async init() {
        const resp = await setting.get_setting();
        this.ctx.dispatch({
            type: eActionType.CHANGE_BACKEND,
            payload: resp.data.backend,
        });
        this.ctx.dispatch({
            type: eActionType.CHANGE_LOGSEQ,
            payload: resp.data.logseq,
        });
    }
}
