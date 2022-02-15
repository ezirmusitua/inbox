import * as crypto from "crypto";
export * from "./parse";
export * from "./rnd";

export function hash(content: string) {
  return crypto.createHash("md5").update(content).digest("base64url");
}

export function clean_file_path(target: string) {
  const char_list = [
    ...Array.from({ length: 32 }).map((_, i) => i),
    ...[
      "/", // (forward slash)
      "<", // (less than)
      ">", // (greater than)
      ":", // (colon - sometimes works, but is actually NTFS Alternate Data Streams)
      '"', // (double quote)
      "\\", // (backslash)
      "|", // (vertical bar or pipe)
      "?", // (question mark)
      "*", // (asterisk),
    ].map((ch) => ch.charCodeAt(0)),
  ];

  const name_list = [
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
  ];
  const chars = [];
  target.split("").forEach((ch: string) => {
    if (char_list.includes(ch.charCodeAt(0))) {
      chars.push("_");
    } else {
      chars.push(ch);
    }
  });
  let out = chars.join("").trim();
  name_list.forEach((pat) => {
    out = out.replace(new RegExp(`^${pat}$\.`, "gi"), "_");
  });
  return out;
}
