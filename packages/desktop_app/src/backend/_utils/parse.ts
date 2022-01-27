import { os } from "@tauri-apps/api";

export function parse_indent(content: string) {
    const lines = content.split(os.EOL).filter((line) => line.trim());
    let root = { raw: "", content: "", children: [] as any };
    let parent = root;
    for (const line of lines) {
        // FIXME: should only split first "\t" token
        const line_part = line.split("\t");
        const content = line_part[line_part.length - 1];
        const indent_depth = line_part.length - 1;
        for (let level = 0; level < indent_depth; level += 1) {
            parent = parent.children[parent.children.length - 1];
        }
        parent.children.push({ raw: line, content, children: [] });
        parent = root;
    }
    return root;
}

// TODO: support unlimited depth
export function join_indent(_data: Array<Record<string, any>>) {
    let out = "";
    for (const item of _data) {
        out += `- ${item.content}${os.EOL}`;
        for (const child of item.children) {
            out += `\t- ${child}${os.EOL}`;
        }
    }
    return out;
}
