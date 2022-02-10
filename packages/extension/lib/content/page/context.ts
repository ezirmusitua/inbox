import { createContext } from "react";
import { iState, iAction } from "./store";

const Context = createContext({
  state: {} as iState,
  dispatch: (_: iAction) => null,
});

export default Context;
