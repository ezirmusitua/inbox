import { ORIGIN_CONTAINER_CLS_NAME } from "./constant";
import { iReadingMode, iReadingModeDef } from "./interface";

export class ReadingMode implements iReadingMode {
  static instance: ReadingMode = null as any;
  private _body: HTMLElement | null = null as any;
  private _origin_container: HTMLElement = null as any;

  constructor() {
    if (!ReadingMode.instance) {
      ReadingMode.instance = this;
      this._make_origin_element();
    }
    return ReadingMode.instance;
  }

  apply(definition: iReadingModeDef) {
    if (!this._body) return;
    const { removed, reserved, css } = definition;
    const cloned = this._origin_container.cloneNode(true) as Element;
    for (const { selector } of removed) {
      const elem = cloned.querySelector(selector);
      console.log("removed element: ", elem, selector);
      if (elem) {
        elem.remove();
      }
    }
    const mode_container = document.createElement("section");
    const mode_class = `__reading_mode-${definition.id}-container`;
    mode_container.setAttribute("class", mode_class);
    for (const { selector, new_selector } of reserved) {
      const elem = cloned.querySelector(selector);
      console.log("reserved element: ", elem, selector);
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
    // TODO: show loading mask
    this._origin_container.style.display = "none";
    this._body.append(mode_container);
    // TODO: hide loading mask
  }

  private _make_origin_element() {
    this._body = document.querySelector("body");
    if (this._body) {
      // TODO: show loading mask
      this._origin_container = document.createElement("section");
      this._origin_container.setAttribute("class", ORIGIN_CONTAINER_CLS_NAME);
      Array.from(this._body.children).forEach((elem) => {
        console.log("element to copy: ", elem);
        if (!["script", "style"].includes(elem.nodeName.toLowerCase())) {
          this._origin_container.append(elem);
        }
      });
      this._body.append(this._origin_container);
      // TODO: hide loading mask
    }
  }
}
