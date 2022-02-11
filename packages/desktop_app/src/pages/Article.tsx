import ArticleList from "components/ArticleList";
import Layout from "components/Layout";
import { useEffect, useReducer } from "react";
import ArticleAction from "./Article.action";
import {
    ArticleContext,
    eActionType,
    init_state,
    reducer,
} from "./Article.store";

export default function ArticlePage() {
    const [state, dispatch] = useReducer(reducer, init_state);
    const article_action = new ArticleAction({ state, dispatch });
    useEffect(() => {
        article_action.init();
    }, []);
    return (
        <Layout>
            <ArticleContext.Provider value={{ state, dispatch }}>
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
            </ArticleContext.Provider>
        </Layout>
    );
}
