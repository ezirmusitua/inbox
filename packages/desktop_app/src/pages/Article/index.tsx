import ArticleList from "components/ArticleList";
import Layout from "components/Layout";
import { useEffect, useReducer } from "react";
import { init } from "./action";
import context, { eActionType, init_state, reducer } from "./context";

export default function ArticlePage() {
    const [state, dispatch] = useReducer(reducer, init_state);
    useEffect(() => {
        init({ state, dispatch });
    });
    return (
        <Layout>
            <context.Provider value={{ state, dispatch }}>
                <ArticleList
                    title="汇总信息列表"
                    items={state.items}
                    on_remove={(item) =>
                        dispatch({
                            type: eActionType.CHANGE_ITEMS,
                            payload: state.items.filter(
                                ({ _url_hash }) => _url_hash !== item._url_hash,
                            ),
                        }) as any
                    }
                ></ArticleList>
            </context.Provider>
        </Layout>
    );
}
