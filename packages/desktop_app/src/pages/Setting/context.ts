import { iSetting } from "@inbox/shared";
import { iState } from "App.store";
import { createContext } from "react";

export interface iSettingState {
    setting: iSetting;
}

export interface iAction {
    type: eActionType;
    payload?: any;
}

export enum eActionType {
    INITIALIZE,
    CHANGE_BACKEND,
    CHANGE_LOGSEQ,
}

export const init_state: iSettingState = {
    setting: {} as iSetting,
};

function change_setting_field(
    state: iSettingState,
    field: string,
    payload: Record<string, any>,
) {
    return {
        ...state,
        setting: {
            ...state.setting,
            backend: {
                ...state.setting[field],
                ...payload,
            },
        },
    };
}

export function reducer(state: iSettingState, action: iAction) {
    switch (action.type) {
        case eActionType.INITIALIZE:
            return { ...state, setting: action.payload };
        case eActionType.CHANGE_BACKEND:
            return change_setting_field(state, "backend", action.payload);
        case eActionType.CHANGE_LOGSEQ:
            return change_setting_field(state, "logseq", action.payload);
        default:
            return { ...state };
    }
}

export interface iContextValue {
    state: iState;
    dispatch: React.Dispatch<iAction>;
}

export default createContext({
    state: init_state,
    dispatch: (_: iAction) => null as any,
});
