import { createContext } from "react";
import { iArticle } from "@inbox/shared";

export interface iDayArticleData {
    title: string;
    items: iArticle[];
}

export enum eActionType {
    CHANGE_INITIALIZED,
    CHANGE_ITEMS,
}

export interface iTodayState {
    title: string;
    items: iArticle[];
    initialized: boolean;
}

export interface iAction {
    type: eActionType;
    payload: any;
}

export const init_state: iTodayState = {
    title: "",
    items: [],
    initialized: false,
};

export function reducer(state: iTodayState, action: iAction) {
    switch (action.type) {
        case eActionType.CHANGE_ITEMS:
            console.log(
                "today change items: ",
                action.payload.map((i) => ({
                    ...i,
                    saved_at: new Date(i.saved_at),
                })),
            );
            const items = action.payload.map((i) => ({
                ...i,
                saved_at: new Date(i.saved_at),
            }));
            return { ...state, items };
        case eActionType.CHANGE_INITIALIZED:
            return { ...state, initialized: action.payload };
        default:
            return { ...state };
    }
}

export interface iTodayContextValue {
    state: iTodayState;
    dispatch: React.Dispatch<iAction>;
}

export const TodayContext = createContext({
    state: init_state,
    dispatch: (action: iAction) => {},
});
