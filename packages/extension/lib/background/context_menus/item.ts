import { action } from "../actions";
import Repo from "../repo";

export const MENU_ITEM_ID = "extension_menu_item_id";

export const MenuItemDef = {
  title: "Extension Menu Item Label",
  contexts: ["selection"],
  enabled: true,
};

export function append_id_to(_def: any) {
  return { ..._def, id: MENU_ITEM_ID };
}

export class MenuItemClickHandler {
  constructor(private readonly _repo: Repo) {}

  async handle(info: chrome.contextMenus.OnClickData, _: chrome.tabs.Tab) {
    action()
  }
}
