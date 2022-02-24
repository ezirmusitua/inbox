import ArticleList from "components/ArticleList";
import Layout from "components/Layout";
import { DateTime } from "luxon";
import { useEffect, useReducer } from "react";
import { init } from "./action";
import context, { eActionType, init_state, reducer } from "./context";

export default function TodayPage() {
    const [state, dispatch] = useReducer(reducer, init_state);
    const title = DateTime.now().toFormat("dd, MMMM yyyy");
    useEffect(() => {
        init({ state, dispatch });
    });
    return (
        <Layout>
            <context.Provider value={{ state, dispatch }}>
                <ArticleList
                    title={title}
                    items={state.items}
                    on_remove={(item) => {
                        return dispatch({
                            type: eActionType.CHANGE_ITEMS,
                            payload: state.items.filter(
                                ({ _url_hash }) => _url_hash !== item._url_hash,
                            ),
                        }) as any;
                    }}
                ></ArticleList>
            </context.Provider>
        </Layout>
    );
}
