export type tRegex = string;
export type tCSSString = string;
const ORIGIN_CONTAINER_CLS_NAME = "__reading_mode-origin_container";
export interface iElement {
  selector: string;
}

export interface iReservedElement extends iElement {
  new_selector: string;
  selector: string;
}

export interface iReadingModelRule {
  id: string;
  name: string;
  description: string;
  url_pattern: tRegex;
  removed: iElement[];
  reserved: iReservedElement[];
  css: tCSSString[];
}

export class ReadingModeRule {
  constructor(private readonly _data: ReadingModeRule) {}
}

export interface iReadingMode {
  apply(rule: iReadingModelRule): void;
}

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

  apply(rule: iReadingModelRule) {
    if (!this._body) return;
    const { removed, reserved, css } = rule;
    const cloned = this._origin_container.cloneNode(true) as Element;
    for (const { selector } of removed) {
      const elem = cloned.querySelector(selector);
      console.log("removed element: ", elem, selector);
      if (elem) {
        elem.remove();
      }
    }
    const mode_container = document.createElement("section");
    const mode_class = `__reading_mode-${rule.name}-container`;
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
        if (!["script", "style"].includes(elem.nodeName.toLowerCase())) {
          this._origin_container.append(elem);
        }
      });
      this._body.append(this._origin_container);
      // TODO: hide loading mask
    }
  }
}
