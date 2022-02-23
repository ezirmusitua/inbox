import * as fs from "fs";
import * as path from "path";

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

export interface iDirectoryFile {
  name: string;
  path: string;
}

export function remove_file_silently(fp: string) {
  if (!fs.existsSync(fp)) return;
  return new Promise((resolve, reject) =>
    fs.unlink(fp, (err) => {
      if (err) return reject(err);
      return resolve(true);
    }),
  );
}

export function save_file(content: string | Buffer, fp: string) {
  return new Promise((resolve, reject) =>
    fs.writeFile(fp, content, (err) => {
      if (err) return reject(err);
      return resolve(true);
    }),
  );
}

export function read_file_silently(fp: string): Promise<string> {
  if (!fs.existsSync(fp)) return Promise.resolve("");
  return new Promise((resolve) =>
    fs.readFile(fp, (_, data) => resolve(data.toString())),
  );
}

export function read_dir(
  dir: string,
  filter_fn = (_: string) => true,
): Promise<iDirectoryFile[]> {
  return new Promise((resolve, reject) =>
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err);
      return resolve(
        files.filter(filter_fn).map((name) => ({
          name,
          path: path.join(dir, name),
        })),
      );
    }),
  );
}

export function ensure_dir(dir: string) {
  // TODO: enable mkdir recursively
  if (fs.existsSync(dir)) return;
  return new Promise((resolve, reject) =>
    fs.mkdir(dir, (err) => {
      if (err) return reject(err);
      return resolve(true);
    }),
  );
}
