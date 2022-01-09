import { createContext } from "react";
import { iState, iPayload } from "./store";

const Context = createContext({
  state: {} as iState,
  dispatch(action: iPayload) {
    return;
  },
});

export default Context;
