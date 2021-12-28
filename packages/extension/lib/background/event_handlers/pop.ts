import { eErrorCode, iMsg } from "@logseq_inbox/shared";
import { action } from "../actions";
import { ContextMenu } from "../context_menus";
import Repo from "../repo";
import { tMsgPort } from "./interface";

export class PopMessageHandler {
  constructor(private readonly _repo: Repo) {}

  async handle(msg: iMsg, port: tMsgPort) {
    switch (msg.type) {
      case "pop_event":
        this.handle_pop_event(msg, port);
        break;
      default:
        break;
    }
  }

  async handle_pop_event(msg: iMsg, port: tMsgPort) {
    try {
      action();
      new ContextMenu(this._repo).update();
      port.postMessage({
        type: "pop_event",
        data: {},
      });
    } catch {
      console.log("[Extension] error");
      port.postMessage({
        type: "error",
        data: { code: eErrorCode.UNKNOWN },
      });
    }
  }
}
