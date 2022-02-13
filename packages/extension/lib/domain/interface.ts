export interface iElement {
  selector: string;
}

export interface iReservedElement extends iElement {
  new_selector: string;
  selector: string;
}

export interface iReadingModeDef {
  id: string;
  name: string;
  url_pattern: tRegex;
  removed: iElement[];
  reserved: iReservedElement[];
  css: tCSSString[];
}

export interface iReadingMode {
  apply(rule: iReadingModeDef): void;
}

export type tRegex = string;

export type tCSSString = string;
