import { dialog, fs } from "@tauri-apps/api";
import { useEffect, useReducer } from "react";
import { Route, Routes } from "react-router-dom";
import { InitSettingDto } from "shared/setting";
import "./App.css";
import { init_state, reducer } from "./App.store";
import HomePage from "./pages/Home";
import SettingPage from "./pages/Setting";
import { setting_ctrl } from "./resource";

function App() {
    const [state, dispatch] = useReducer(reducer, init_state);
    async function init() {
        const resp = await setting_ctrl.check_initialized();
        console.log(resp);
        if (!resp.data) {
            // eslint-disable-next-line
            const yes = await confirm(
                "Please select the logseq data directory.",
            );
            if (yes) {
                const dir_path = await dialog.open({ directory: true });
                await setting_ctrl.init_setting(
                    new InitSettingDto(dir_path as string),
                );
            }
        } else {
        }
    }
    function destroy() {}
    useEffect(() => {
        init();
        return () => destroy();
    }, []);

    async function select_file() {
        const dir_path = await dialog.open({ directory: true });
        const target_path = `${dir_path}/202201231212.md`;
        try {
            await fs.writeFile({
                path: target_path,
                contents: `- hello world`,
            });
        } catch (e) {
            console.log("to write: ", target_path);
            console.log(e);
        }
    }

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<HomePage></HomePage>}></Route>
                <Route
                    path="/setting"
                    element={<SettingPage></SettingPage>}
                ></Route>
            </Routes>
        </div>
    );
}

export default App;
