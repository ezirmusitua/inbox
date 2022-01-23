import { dialog, fs } from "@tauri-apps/api";
import { useEffect, useReducer } from "react";
import { InitSettingDto } from "shared/setting";
import "./App.css";
import logo from "./assets/logo.svg";
import tauriCircles from "./assets/tauri.svg";
import tauriWord from "./assets/wordmark.svg";
import { setting_ctrl } from "./resource";

interface iState {
    db_data: any;
}

interface iAction {
    type: string;
    payload: any;
}

const init_state: iState = {
    db_data: {},
};

function reducer(state: iState, action: iAction) {
    switch (action.type) {
        case "set_db_data":
            return { ...state, db_data: action.payload };
    }
    return { ...state };
}

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
        console.log(state.db_data);
        const dir_path = await dialog.open({ directory: true });
        console.log("to write: ", dir_path);
        const target_path = `${dir_path}/202201231212.md`;
        try {
            console.log("to write: ", target_path);
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
            <header className="App-header">
                <div className="inline-logo">
                    <img
                        src={tauriCircles}
                        className="App-logo rotate"
                        alt="logo"
                    />
                    <img
                        src={tauriWord}
                        className="App-logo smaller"
                        alt="logo"
                    />
                </div>
                <a
                    className="App-link"
                    href="https://tauri.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {state.db_data._updated_at}
                </a>
                <img src={logo} className="App-logo rotate" alt="logo" />
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <p onClick={select_file}>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
            </header>
        </div>
    );
}

export default App;
