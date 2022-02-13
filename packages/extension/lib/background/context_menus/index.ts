import Repo from "../repo";
import {
  SendSelectionHandler,
  SendSelectionItemDef,
  SEND_SELECTION_MENU_ITEM_ID,
  append_id_to,
} from "./send_selection";

export class ContextMenu {
  static instance: ContextMenu = null as any;
  private _handlers: Record<string, any> = {} as any;

  constructor(private readonly _repo: Repo) {
    if (!ContextMenu.instance) {
      this._handlers[SEND_SELECTION_MENU_ITEM_ID] = new SendSelectionHandler(
        this._repo
      );
      ContextMenu.instance = this;
    }
    return ContextMenu.instance;
  }

  init() {
    chrome.contextMenus.create(append_id_to(SendSelectionItemDef));
    chrome.contextMenus.onClicked.addListener((info, tabs) =>
      this._handlers[SEND_SELECTION_MENU_ITEM_ID].handle(info, tabs)
    );
  }

  update() {
    chrome.contextMenus.update(
      SEND_SELECTION_MENU_ITEM_ID,
      SendSelectionItemDef
    );
  }
}
