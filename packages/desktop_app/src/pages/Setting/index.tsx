import Layout from "components/Layout";
import { useEffect, useReducer } from "react";
import setting from "resource/setting";
import Backend from "./components/Backend";
import Database from "./components/Database";
import Logseq from "./components/Logseq";
import context, { eActionType, init_state, reducer } from "./context";

export default function SettingPage() {
    const [state, dispatch] = useReducer(reducer, init_state);
    useEffect(() => {
        (async () => {
            const data = await setting.get_setting();
            dispatch({ type: eActionType.INITIALIZE, payload: data.data });
        })();
    }, []);
    return (
        <Layout>
            <context.Provider value={{ state, dispatch }}>
                <Backend></Backend>
                <Logseq></Logseq>
                <Database></Database>
            </context.Provider>
        </Layout>
    );
}
