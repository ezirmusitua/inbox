import ArticleList from "frontend/components/ArticleList";
import Layout from "frontend/components/Layout";
import { useEffect, useReducer } from "react";
import ArticleAction from "./Article.action";
import { ArticleContext, init_state, reducer } from "./Article.store";

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
                    on_remove={() => Promise.resolve({} as any)}
                    on_save={() => Promise.resolve({} as any)}
                ></ArticleList>
            </ArticleContext.Provider>
        </Layout>
    );
}
