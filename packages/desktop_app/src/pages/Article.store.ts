import { createContext } from "react";
import { iArticle } from "@inbox/shared";

export interface iArticleState {
    items: iArticle[];
    initialized: boolean;
}

export interface iAction {
    type: string;
    payload: any;
}

export const init_state: iArticleState = {
    items: [] as iArticle[],
    initialized: false,
};

export function reducer(state: iArticleState, action: iAction) {
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

export interface iArticleContextValue {
    state: iArticleState;
    dispatch: React.Dispatch<iAction>;
}

export const ArticleContext = createContext({
    state: init_state,
    dispatch: (action: iAction) => {},
});
