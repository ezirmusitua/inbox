import { eErrorCode, iMsg } from "@inbox/shared";
import { action } from "../actions";
import Repo from "../repo";
import { tMsgPort } from "./interface";

export class ContentMessageHandler {
  constructor(private readonly _repo: Repo) {}

  async handle(msg: iMsg, port: tMsgPort) {
    switch (msg.type) {
      case "register_tab":
        this.register_tab(msg, port);
        break;
      case "content_event":
        this.handle_content_event(msg, port);
        break;
      default:
        break;
    }
  }

  async register_tab(msg: any, port: tMsgPort) {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    port.postMessage({
      type: "register_tab",
      data: { tab_id: tabs[0]?.id },
    });
  }

  async handle_content_event(msg: iMsg, port: tMsgPort, compress = true) {
    try {
      action();
      port.postMessage({ type: "content_event", data: {} });
    } catch (e) {
      console.log("[Extension] error: ", e);
      port.postMessage({
        type: "error",
        data: { code: eErrorCode.UNKNOWN },
      });
    }
    return;
  }
}
