import ArticleList from "components/ArticleList";
import Layout from "components/Layout";
import { DateTime } from "luxon";
import { useEffect, useReducer } from "react";
import TodayAction from "./Today.action";
import { eActionType, init_state, reducer, TodayContext } from "./Today.store";

export default function TodayPage() {
    const [state, dispatch] = useReducer(reducer, init_state);
    const home_action = new TodayAction({ state, dispatch });
    const title = DateTime.now().toFormat("dd, MMMM yyyy");
    useEffect(() => {
        home_action.init();
    }, []);
    return (
        <Layout>
            <TodayContext.Provider value={{ state, dispatch }}>
                <ArticleList
                    title={title}
                    items={state.items}
                    on_remove={(item) => {
                        console.log(
                            item,
                            state.items.filter(
                                ({ _url_hash }) => _url_hash !== item._url_hash,
                            ),
                        );
                        return dispatch({
                            type: eActionType.CHANGE_ITEMS,
                            payload: state.items.filter(
                                ({ _url_hash }) => _url_hash !== item._url_hash,
                            ),
                        }) as any;
                    }}
                ></ArticleList>
            </TodayContext.Provider>
        </Layout>
    );
}
