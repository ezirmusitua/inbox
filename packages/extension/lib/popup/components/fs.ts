export const ACCEPT_JSON = {
          "application/json": [".json"],
        } as Record<string, string[]>;
export async function save(data: string, accept = ACCEPT_JSON) {
  // @ts-ignore
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: `${new Date()}.json`,
    types: [
      { description: "extension export file", accept },
    ],
  });
  const writable = await fileHandle.createWritable();
  await writable.write(data);
  await writable.close();
}

export async function read(accept = ACCEPT_JSON) {
  const pickerOpts = {
    types: [
      { description: "extension file", accept, },
    ],
    excludeAcceptAllOption: true,
    multiple: false, // 是否多选
  };
  // @ts-ignore
  const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  const file = await fileHandle.getFile();
  const content = await file.text();
  return content;
}
