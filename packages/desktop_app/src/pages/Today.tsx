import ArticleList from "components/ArticleList";
import Layout from "components/Layout";
import { useEffect, useReducer } from "react";
import TodayAction from "./Today.action";
import {
    eActionType,
    iDayArticleData,
    init_state,
    reducer,
    TodayContext,
} from "./Today.store";

export default function TodayPage() {
    const [state, dispatch] = useReducer(reducer, init_state);
    const home_action = new TodayAction({ state, dispatch });
    useEffect(() => {
        home_action.init();
    }, []);
    return (
        <Layout>
            <TodayContext.Provider value={{ state, dispatch }}>
                {state.items.map((day: iDayArticleData, i: number) => (
                    <ArticleList
                        key={i}
                        title={day.title}
                        items={day.items}
                        on_remove={(item) => {
                            console.log(
                                item,
                                state.items.filter(
                                    ({ _url_hash }) =>
                                        _url_hash !== item._url_hash,
                                ),
                            );
                            return dispatch({
                                type: eActionType.CHANGE_ITEMS,
                                payload: state.items.filter(
                                    ({ _url_hash }) =>
                                        _url_hash !== item._url_hash,
                                ),
                            }) as any;
                        }}
                    ></ArticleList>
                ))}
            </TodayContext.Provider>
        </Layout>
    );
}
