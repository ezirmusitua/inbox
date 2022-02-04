import { CONNECTION_NAME } from "@inbox/shared";
import { useEffect, useReducer } from "react";
import Container, { ContentContainer } from "./components/Container";
import ErrorToast from "./components/Toast";
import Context from "./context";
import Service from "./service";
import store from "./store";

interface iPortMsg {
  type: string;
  data: any;
}

export default function Popup() {
  const [state, dispatch] = useReducer(store.reducer, store.state);
  const service = new Service();
  function handle_background_message(msg: iPortMsg) {
    if (!msg) return;
    switch (msg.type) {
      case "connected":
        service.do_something();
        console.log('pop up connected to background')
        break;
      case "pop_event":
        // do something
        console.log("received event", msg);
        break;
    }
  }
  useEffect(() => {
    const connection = chrome.runtime.connect({ name: CONNECTION_NAME.POP });
    service.connection = connection;
    dispatch({ type: "set_connection", payload: connection });
    connection.onMessage.addListener(handle_background_message);
    return () => {
      connection.onMessage.removeListener(handle_background_message);
      connection.disconnect();
    };
  }, []);

  return (
    <Container>
      <Context.Provider value={{ state, dispatch }}>
        <ErrorToast></ErrorToast>
        <ContentContainer>
          Not implemented
        </ContentContainer>
      </Context.Provider>
    </Container>
  );
}
