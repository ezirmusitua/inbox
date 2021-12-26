import Repo from "../repo";
import {
  MenuItemClickHandler,
  MenuItemDef,
  MENU_ITEM_ID,
  append_id_to,
} from "./item";

export class ContextMenu {
  static instance: ContextMenu = null as any;
  private _handlers: Record<string, any> = {} as any;

  constructor(private readonly _repo: Repo) {
    if (!ContextMenu.instance) {
      this._handlers[MENU_ITEM_ID] = new MenuItemClickHandler(this._repo);
      ContextMenu.instance = this;
    }
    return ContextMenu.instance;
  }

  init() {
    chrome.contextMenus.create(append_id_to(MenuItemDef));
    chrome.contextMenus.onClicked.addListener((info, tabs) =>
      this._handlers[MENU_ITEM_ID].handle(info, tabs)
    );
  }

  update() {
    chrome.contextMenus.update(MENU_ITEM_ID, MenuItemDef);
  }
}
