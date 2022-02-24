import ArticlePage from "pages/Article";
import SettingPage from "pages/Setting";
import TodayPage from "pages/Today";
import { useEffect, useReducer } from "react";
import { Route, Routes } from "react-router-dom";
import { init_app } from "./App.action";
import { AppContext, eActionType, init_state, reducer } from "./App.store";

function App() {
    const [state, dispatch] = useReducer(reducer, init_state);
    useEffect(() => {
        init_app();
        dispatch({
            type: eActionType.CHANGE_INITIALIZED,
            payload: true,
        });
    }, []);

    return (
        <div className="App">
            <AppContext.Provider value={{ state, dispatch }}>
                {(state.initialized && (
                    <>
                        <Routes>
                            <Route
                                path="/"
                                element={<TodayPage></TodayPage>}
                            ></Route>
                            <Route
                                path="/article"
                                element={<ArticlePage></ArticlePage>}
                            ></Route>
                            <Route
                                path="/setting"
                                element={<SettingPage></SettingPage>}
                            ></Route>
                        </Routes>
                    </>
                )) || <></>}
            </AppContext.Provider>
        </div>
    );
}

export default App;
