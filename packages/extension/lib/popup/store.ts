import { eErrorCode } from "@logseq_inbox/shared";
export interface iState {
  connection: any;
  error: string;
}

export interface iAction {
  type: string;
  payload: any;
}

export interface iReducer {
  (state: iState, action: iAction): iState;
}

const ErrorMessage = {
  [eErrorCode.UNKNOWN]: "some error message",
} as Record<eErrorCode, string>;

const store = {
  state: {
    connection: null as any,
    error: "",
  },
  reducer(state: iState, action: iAction) {
    const { type, payload } = action;
    if (type === "set_connection") {
      return { ...state, connection: payload };
    }
    if (action.type === "select_error_msg") {
      const msg = ErrorMessage[payload as eErrorCode] || "";
      return { ...state, error: msg };
    }
    return { ...state };
  },
};

export default store;
