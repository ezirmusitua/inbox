import { createContext } from "react";
import store, { iAction } from "./store";

const Context = createContext({
  state: store.state,
  dispatch: (action: iAction) => null as any,
});

export default Context;
