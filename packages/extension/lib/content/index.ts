import {
  CONNECTION_NAME,
  EXTENSION_CONTENT_BTN_ID,
} from "@logseq_inbox/shared";
import { EventHandler } from "./event";

console.log("content ", 0);

class ContentScript {
  private _state = {
    port: null as any,
    tab_id: null as any,
    tab_comm_elem: null as any,
  };

  private _event_handler: EventHandler = null as any;

  register(event_handler: EventHandler) {
    this.init_tab_comm_elem();
    this.connect_to_bg();
    this.start_forward_bg_msg();
    this._event_handler = event_handler;
  }

  connect_to_bg() {
    this._state.port = chrome.runtime.connect({
      name: CONNECTION_NAME.CONTENT,
    });
  }
  /**
   * init_tab_comm_elem
   * @description create an element for communication between content script and tab
   * @param bg_port connection port
   * @returns
   */
  init_tab_comm_elem() {
    const body = document.querySelector("body");
    if (!body) return null;
    // 建立和当前 tab 中 window 的连接
    this._state.tab_comm_elem = document.createElement("button");
    this._state.tab_comm_elem.id = EXTENSION_CONTENT_BTN_ID;
    this._state.tab_comm_elem.style.visibility = "hidden";
    body.appendChild(this._state.tab_comm_elem);
    this._state.tab_comm_elem.addEventListener("click", (e: any) =>
      this.handle_tab_msg_forwarding(e)
    );
  }

  handle_tab_msg_forwarding(e: { target: HTMLElement }) {
    if (!e || !e.target || !e.target.innerHTML) return;
    const msg = JSON.parse(e.target.innerHTML);
    if (msg.type === "$$destroy") {
      this._state.tab_comm_elem.removeEventListener(
        "click",
        this.handle_tab_msg_forwarding
      );
    } else {
      this._state.port.postMessage({
        ...msg,
        tab_id: this._state.tab_id,
      });
    }
  }

  /**
   * start_forward_bg_msg
   * @description connect to background and forward background message to tab
   * @param bg_port connection port
   */
  start_forward_bg_msg() {
    this._state.port.onMessage.addListener((msg: any) => {
      if (msg.type === "connected") {
        this._state.port.postMessage({ type: "register_tab" });
        return;
      }

      if (msg.type === "register_tab") {
        this._state.tab_id = msg.data.tab_id;
        this._event_handler._state = this._state;
        return;
      }

      const should_forward = this._event_handler.handle(msg);
      if (should_forward) {
        window.postMessage(msg, "*");
      }
    });
  }
}

try {
  const cs = new ContentScript();
  cs.register(new EventHandler());
} catch (e) {
  console.log("content -1: ", e);
}
