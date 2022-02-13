import { make_snippet } from "../actions";
import Repo from "../repo";

export const SEND_SELECTION_MENU_ITEM_ID = "_inbox_send_selection";

export const SendSelectionItemDef = {
  title: "发送选中内容",
  contexts: ["selection"],
  enabled: true,
};

export function append_id_to(_def: any) {
  return { ..._def, id: SEND_SELECTION_MENU_ITEM_ID };
}

export class SendSelectionHandler {
  constructor(private readonly _repo: Repo) {}

  handle(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) {
    const { selectionText, pageUrl } = info;
    return make_snippet(pageUrl, tab.title, selectionText);
  }
}
