import { createContext } from "react";
import { iArticle } from "shared/article";

export interface iDayArticleData {
    title: string;
    items: iArticle[];
}

export interface iTodayState {
    items: iDayArticleData[];
    initialized: boolean;
}

export interface iAction {
    type: string;
    payload: any;
}

export const init_state: iTodayState = {
    items: [] as iDayArticleData[],
    initialized: false,
};

export function reducer(state: iTodayState, action: iAction) {
    switch (action.type) {
        case "set_items":
            return { ...state, items: action.payload };
        case "set_initialized":
            return { ...state, initialized: action.payload };
    }
    return { ...state };
}

export interface iTodayContextValue {
    state: iTodayState;
    dispatch: React.Dispatch<iAction>;
}

export const TodayContext = createContext({
    state: init_state,
    dispatch: (action: iAction) => {},
});
