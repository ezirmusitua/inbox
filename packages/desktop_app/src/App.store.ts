import { createContext } from "react";

export interface iState {
    setting: any;
    initialized: boolean;
}

export enum eActionType {
    CHANGE_SETTING,
    CHANGE_INITIALIZED,
}

export interface iAction {
    type: eActionType;
    payload: any;
}

export const init_state: iState = {
    setting: {},
    initialized: false,
};

export function reducer(state: iState, action: iAction) {
    switch (action.type) {
        case eActionType.CHANGE_SETTING:
            return { ...state, setting: action.payload };
        case eActionType.CHANGE_INITIALIZED:
            return { ...state, initialized: action.payload };
        default:
            return { ...state };
    }
}

export interface iAppContextValue {
    state: iState;
    dispatch: React.Dispatch<iAction>;
}

export const AppContext = createContext({
    state: init_state,
    dispatch: (action: iAction) => {},
});
