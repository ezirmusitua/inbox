import { EXTENSION_CONTENT_BTN_ID } from "@inbox/shared";
import { ORIGIN_CONTAINER_CLS_NAME } from "./constant";
import { iReadingMode, iReadingModeDef } from "./interface";

// TODO: move RM_MOUNTED_ID to @inbox/shared
const RM_MOUNTED_ID = "__reading_mode_view_mount_point";

export class ReadingMode implements iReadingMode {
  static instance: ReadingMode = null as any;
  private _body: HTMLElement | null = null as any;
  private _origin_container: HTMLElement = null as any;

  constructor() {
    if (!ReadingMode.instance) {
      ReadingMode.instance = this;
    }
    return ReadingMode.instance;
  }

  apply(def: iReadingModeDef) {
    const mode_container = this.generate_mode_view(def);
    // TODO: show loading mask
    this._origin_container.style.display = "none";
    this._body.append(mode_container);
    // TODO: hide loading mask
  }

  generate_mode_view(def: iReadingModeDef) {
    const mode_class = `__reading_mode-${def.id}-container`;
    let mode_container = document.querySelector(mode_class);
    if (mode_container) return mode_container;
    this._make_origin_element();
    if (!this._body) return;
    const { removed, reserved, css } = def;
    const cloned = this._origin_container.cloneNode(true) as Element;
    for (const { selector } of removed) {
      const elem = cloned.querySelector(selector);
      if (elem) {
        elem.remove();
      }
    }
    mode_container = document.createElement("section");
    mode_container.setAttribute("class", mode_class);
    for (const { selector } of reserved) {
      // TODO: 这里需要保留顺序
      const elem = cloned.querySelector(selector);
      if (elem) {
        // elem.setAttribute("class", new_selector);
        mode_container.append(elem);
      }
    }
    if (css) {
      const style_el = document.createElement("style");
      style_el.setAttribute("type", "text/css");
      style_el.innerHTML = css
        .map((css_str) => `.${mode_class} ${css_str}`)
        .join("\n\n");
      document.querySelector("head")?.append(style_el);
    }
    cloned.remove();
    return mode_container;
  }

  private _make_origin_element() {
    this._body = document.querySelector("body");
    if (this._body) {
      // TODO: show loading mask
      this._origin_container = document.createElement("section");
      this._origin_container.setAttribute("class", ORIGIN_CONTAINER_CLS_NAME);
      Array.from(this._body.children).forEach((elem) => {
        const is_style_or_script = ["script", "style"].includes(
          elem.nodeName.toLowerCase()
        );
        const from_extension = [
          EXTENSION_CONTENT_BTN_ID,
          RM_MOUNTED_ID,
        ].includes(elem.getAttribute("id"));
        if (!is_style_or_script && !from_extension) {
          this._origin_container.appendChild(elem);
        }
      });
      this._body.appendChild(this._origin_container);
      // TODO: hide loading mask
    }
  }
}
