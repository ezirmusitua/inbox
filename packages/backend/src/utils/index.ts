import * as crypto from "crypto";
export * from "./rnd";
export * from "./file";

export function hash(content: string) {
  return crypto.createHash("md5").update(content).digest("base64url");
}
