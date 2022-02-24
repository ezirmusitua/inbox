import Layout from "components/Layout";
import { useReducer } from "react";
import context, { reducer, init_state } from "./context";

export default function SettingPage() {
    const [state, dispatch] = useReducer(reducer, init_state);
    return (
        <Layout>
            <context.Provider value={{ state, dispatch }}></context.Provider>
        </Layout>
    );
}
