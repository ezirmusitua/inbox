/**
 * This script is used to rename the binary with the platform specific postfix.
 * When `tauri build` is ran, it looks for the binary name appended with the platform specific postfix.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const Architectures = {
  "macos:arm64": "arm64-apple-darwin",
  "macos:x64": "x86_64-apple-darwin",
  "linux:arm64": "arm64-unknown-linux-gnu",
  "linux:x64": "x86_64-unknown-linux-gnu",
  "win:arm64": "arm64-pc-windows-msvc",
  "win:x64": "x86_64-pc-windows-msvc",
};

async function main() {
  const arch = process.argv[2].trim();
  const extension = arch.startsWith("win") ? ".exe" : "";
  const targetTriple = Architectures[arch];
  console.log(arch, extension, targetTriple);
  if (!targetTriple) {
    console.error("Failed to determine platform target triple");
  }
  fs.renameSync(
    `../desktop_app/src-tauri/binaries/app${extension}`,
    `../desktop_app/src-tauri/binaries/app-${targetTriple}${extension}`,
  );
}

main().catch((e) => {
  throw e;
});
