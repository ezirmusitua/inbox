import { createContext } from "react";

export interface iState {
    setting: any;
    initialized: boolean;
}

export interface iAction {
    type: string;
    payload: any;
}

export const init_state: iState = {
    setting: {},
    initialized: false,
};

export function reducer(state: iState, action: iAction) {
    switch (action.type) {
        case "set_setting":
            return { ...state, setting: action.payload };
        case "set_initialized":
            return { ...state, initialized: action.payload };
    }
    return { ...state };
}

export interface iAppContextValue {
    state: iState;
    dispatch: React.Dispatch<iAction>;
}

export const AppContext = createContext({
    state: init_state,
    dispatch: (action: iAction) => {},
});
