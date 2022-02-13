import { useContext, useEffect } from "react";
import Context from "../context";
import { eErrorCode } from "@inbox/shared";
import { Transition } from "@headlessui/react";

interface iErrorMsg {
  type: "error";
  data: { code: eErrorCode };
}

export function show_error(dispatch: any, code: eErrorCode) {
  dispatch({ type: "select_error_msg", payload: code });
  let t = setTimeout(() => {
    dispatch({ type: "select_error_msg", payload: eErrorCode.UNKNOWN });
    clearTimeout(t);
    t = null as any;
  }, 2000);
}

function ErrorToast() {
  const ctx = useContext(Context);
  const {
    state: { connection, error: msg },
    dispatch,
  } = ctx;
  function handle_error(msg: iErrorMsg) {
    if (msg.type !== "error") return;
    show_error(dispatch, msg.data.code);
  }
  useEffect(() => {
    connection.onMessage.addListener(handle_error);
    return () => {
      connection.onMessage.removeListener(handle_error);
    };
  }, []);
  if (!connection) return null;
  return (
    <Transition
      show={!!msg}
      enter="_ibe-transition-all _ibe-duration-300"
      enterFrom="_ibe-opacity-0 _ibe-h-0"
      enterTo="_ibe-opacity-100 _ibe-h-auto"
      leave="_ibe-transition-all _ibe-duration-150"
      leaveFrom="_ibe-opacity-100 _ibe-h-auto"
      leaveTo="_ibe-opacity-0 _ibe-h-0"
    >
      <div
        className="_ibe-p-2 _ibe-absolute _ibe-right-0 _ibe-bg-red-400 _ibe-flex _ibe-justify-center"
        style={{
          left: "2px",
          top: "2px",
          height: !msg ? "0px" : "auto",
          opacity: !msg ? "0" : "1",
        }}
      >
        <span className="_ibe-text-white">{msg}</span>
      </div>
    </Transition>
  );
}

export default ErrorToast;
