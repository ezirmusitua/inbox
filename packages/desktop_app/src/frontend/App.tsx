import { useEffect, useReducer } from "react";
import { Route, Routes } from "react-router-dom";
import AppAction from "./App.action";
import { AppContext, init_state, reducer } from "./App.store";
import HomePage from "./pages/Home";
import SettingPage from "./pages/Setting";

function App() {
    const [state, dispatch] = useReducer(reducer, init_state);
    const app_action = new AppAction({ state, dispatch });
    useEffect(() => {
        app_action.init();
    }, []);

    return (
        <div className="App">
            <AppContext.Provider value={{ state, dispatch }}>
                {(state.initialized && (
                    <>
                        <Routes>
                            <Route
                                path="/"
                                element={<HomePage></HomePage>}
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
