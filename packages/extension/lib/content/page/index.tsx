import { useReducer } from "react";
import { render } from "react-dom";
import Fab from "./components/fab";
import Toolbar from "./components/toolbar";
import Context from "./context";
import Service from "./service";
import { init_state, reducer } from "./store";
import "./style.css";

function ReadingModeTool() {
  const [state, dispatch] = useReducer(reducer, init_state);
  console.log("reading mode tool mounted");
  return (
    <div>
      <Context.Provider value={{ state, dispatch }}>
        <Fab></Fab>
        <Toolbar></Toolbar>
      </Context.Provider>
    </div>
  );
}

export default function mount_view(api: Record<string, any>) {
  const mount_point = document.createElement("div");
  const service = new Service();
  service.set_api(api);
  mount_point.setAttribute("id", "reading_mode_view_mount_point");
  document.querySelector("body")?.appendChild(mount_point);
  render(<ReadingModeTool />, mount_point);
}
