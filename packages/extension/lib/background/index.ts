import { CONNECTION_NAME } from "@inbox/shared";
import { ContextMenu } from "./context_menus";
import { ContentMessageHandler, PopMessageHandler } from "./event_handlers";
import Repo from "./repo";

const repo = new Repo();
const context_menus = new ContextMenu(repo);
context_menus.init();

repo.init().then(() => {
  context_menus.update();
});

const allowed_connection = [CONNECTION_NAME.CONTENT, CONNECTION_NAME.POP];

const handlers = {
  [CONNECTION_NAME.CONTENT]: new ContentMessageHandler(repo),
  [CONNECTION_NAME.POP]: new PopMessageHandler(repo),
};


chrome.runtime.onConnect.addListener(async (port) => {
  if (!allowed_connection.includes(port.name)) return;
  port.postMessage({ type: "connected" });
  port.postMessage({ type: "start_reading_mode" });
  port.onMessage.addListener((m, p) => {
    handlers[port.name].handle(m, p);
  });
});
