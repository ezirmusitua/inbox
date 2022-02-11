import { createContext } from "react";
import { iArticle } from "@inbox/shared";

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
            const items = action.payload.map((i) => ({
                ...i,
                saved_at: new Date(i.saved_at),
            }));
            return { ...state, items };
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
