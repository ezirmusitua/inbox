import { ValueTransformer } from "typeorm";

export class JSONTransformer implements ValueTransformer {
  constructor(private default_value: Record<string, any> = {}) {}

  to(value: Record<string, any>) {
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value);
    } catch (e) {
      return this.default_value;
    }
  }

  from(value: string) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return JSON.stringify(this.default_value);
    }
  }
}
