import { CONNECTION_NAME, EXTENSION_CONTENT_BTN_ID } from "@logseq_inbox/shared";

const bg_port = chrome.runtime.connect({ name: CONNECTION_NAME.CONTENT });

let tab_id: number;

function init_communication_event(bg_port: {
  postMessage: (message: any) => void;
}) {
  const body = document.querySelector("body");
  if (!body) return null;
  // 建立和当前 tab 中 window 的连接
  const extension_btn = document.createElement("button");
  extension_btn.id = EXTENSION_CONTENT_BTN_ID;
  extension_btn.style.visibility = "hidden";
  extension_btn.addEventListener("click", () => {
    const msg = JSON.parse(extension_btn.innerHTML);
    if (msg.type === "$$destroy") {
      extension_btn.removeEventListener("click", () => {});
    } else {
      bg_port.postMessage({ ...msg, tab_id });
    }
  });
  body.appendChild(extension_btn);
  return extension_btn;
}

export function register_proxy(bg_port: any) {
  bg_port.onMessage.addListener((msg: any) => {
    if (msg.type === "connected") {
      const success = init_communication_event(bg_port);
      if (success) {
        bg_port.postMessage({ type: "register_tab" });
      } else {
        // TODO: throw error
        console.log("init extension communication failed");
      }
      return;
    } else if (msg.type === "register_tab") {
      tab_id = msg.data.tab_id;
      return;
    } else {
      window.postMessage(msg, "*");
    }
  });
}

chrome.runtime.connect();

register_proxy(bg_port);
