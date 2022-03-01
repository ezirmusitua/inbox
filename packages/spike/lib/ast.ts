import * as fs from "fs";
import * as path from "path";

// const input = `- [[Sample Page]]
// - ::url: https://baidu.com
// ::saved_at: 2022-02-18 23:59
// ::keywords: sample
// - SOURCE: ![Sample Page.pdf](../assets/Sample Page.pdf)
// - CLIPS
// 	- > 这是一篇充满愤怒的博客。作者是一位出生于 70 年代的“技术愤青”unixsheikh，他用“激进”的方式抛出了一个观点：“Web 开发人员应该花费更多时间来进行优化”。\n很显然，把问题归咎于 Web 开发有些偏颇，但他的观点也的确喊出了一些人的心声。文章发出后，有支持者给他发邮件说：“关于文中的问题，我也一直在跟自己的老师和伙伴们争辩。我用过一个项目工具，里面包含 1786 个包、存在 69 项漏洞——45 个中风险、20 个高风险、4 个严重风险。其‘重达’432 MB，而且内部如同一团乱麻。更可笑的是，用它甚至不足以输出‘hello world’，因为还另外需要单独的路由包和状态管理包。这一切太疯狂了，但每个人都在这条路上狂奔，还美其名曰‘现代方法’。”
// 		- Sample Note 1
// 		- Sample Note 2`;

const input = fs.readFileSync(path.join("data", "input.md")).toString();

const KEYWORDS = [
    "\t*- ", // start of line
    "[[", // start of bi-link
    "]]", // end of bi-link
    "::", // start of tag name
    ":", // start of tag value
    "> ", // start  of quote
    "![", // start of asset caption
    "](", // end of asset caption and start of asset src
    ")", // end of asset src
];

export enum eTokenType {
    ROOT = "root",
    LINE = "line",
    BI_LINK = "bi-link",
    TAG = "tag",
    ASSET = "asset",
    LINK = "link",
    QUOTE = "quote",
    TEXT = "text",
}

export interface iASTreeNode {
    type: eTokenType;
    children: string[] | iASTreeNode[];
}

export class ASTree {
    static parse(source: string): iASTreeNode[] {
        const tokens = ASTree.scan(source);
        const forest = [];
        let prev = null;
        let current = null;
        let i = 0;
        while (i < tokens.length) {
            let token = tokens[i];
            if (token === "START") {
                current = {
                    type: eTokenType.ROOT,
                    children: [],
                };
                forest.push(current);
            }
            if (token === "INDENT") {
                while (tokens[i] === "INDENT") {
                    current = current.children[current.children.length - 1];
                    i += 1;
                }
                i -= 1;
            }
            if (token === "LINE START") {
                const node = {
                    type: eTokenType.LINE,
                    children: [],
                };
                current.children.push(node);
                prev = current;
                current = node;
            }
            if (token === "BI_LINK [[") {
                const node = {
                    type: eTokenType.BI_LINK,
                    children: [],
                };
                current.children.push(node);
                prev = current;
                current = node;
            }
            if (token === "BI_LINK ]]") {
                current = prev;
            }
            if (token === "ASSET ![") {
                const node = {
                    type: eTokenType.ASSET,
                    children: [],
                };
                current.children.push(node);
                prev = current;
                current = node;
            }
            if (token === "ASSET )") {
                current = prev;
            }

            if (token === "LINK [") {
                const node = {
                    type: eTokenType.LINK,
                    children: [],
                };
                current.children.push(node);
                prev = current;
                current = node;
            }
            if (token === "ASSET )") {
                current = prev;
            }

            if (token === "TAG FIELD ::") {
                const node = {
                    type: eTokenType.TAG,
                    children: [],
                };
                current.children.push(node);
                prev = current;
                current = node;
            }
            if (token === "TAG VALUE :") {
            }

            if (token === "QUOTE START") {
                const node = {
                    type: eTokenType.QUOTE,
                    children: [],
                };
                current.children.push(node);
                prev = current;
                current = node;
            }

            if (token === "LINEBREAK" && tokens[i + 1] !== "TAG FIELD ::") {
                current = forest[forest.length - 1];
            }
            if (token === "LINEBREAK" && tokens[i + 1] === "TAG FIELD ::") {
                current = prev;
            }

            if (token.startsWith("STRING ")) {
                current.children.push({
                    type: eTokenType.TEXT,
                    children: [token.slice(7).trim()],
                });
            }
            i += 1;
        }
        return forest;
    }

    static stringify(root: iASTreeNode) {
        function _stringify(node: iASTreeNode, level = 0) {
            let _out = "";
            if (node.type === eTokenType.ROOT) {
                for (const child of node.children) {
                    _out += _stringify(child as iASTreeNode, 0);
                }
                return _out;
            }
            if (node.type === eTokenType.TEXT) {
                return _out + node.children[0];
            }
            if (node.type === eTokenType.LINE) {
                _out += `\n${"\t".repeat(level)}- `;
                for (const child of node.children) {
                    _out += _stringify(child as iASTreeNode, level + 1);
                }
                return _out;
            }
            if (node.type === eTokenType.BI_LINK) {
                _out += "[[";
                _out += _stringify(node.children[0] as iASTreeNode);
                _out += "]]";
                return _out;
            }
            if (node.type === eTokenType.LINK) {
                _out += "[";
                _out += _stringify(node.children[0] as iASTreeNode);
                _out += "]";
                return _out;
            }
            if (node.type === eTokenType.ASSET) {
                _out += "![";
                _out += _stringify(node.children[0] as iASTreeNode);
                _out += "]";
                _out += "(";
                _out += _stringify(node.children[1] as iASTreeNode);
                _out += ")";
                return _out;
            }
            if (node.type === eTokenType.TAG) {
                _out += "::";
                _out += _stringify(node.children[0] as iASTreeNode);
                _out += ":";
                _out += _stringify(node.children[1] as iASTreeNode);
                _out += "\n";
                return _out;
            }
            if (node.type === eTokenType.QUOTE) {
                _out += "> ";
                _out += _stringify(node.children[0] as iASTreeNode);
                return _out;
            }
        }

        return _stringify(root);
    }

    static scan(chars: string) {
        const tokens = ["START"];
        let i = 0;
        while (i < chars.length) {
            switch (chars[i]) {
                case "-":
                    if (
                        ["START", "INDENT", "LINEBREAK"].includes(tokens[0]) &&
                        chars[i + 1] === " "
                    ) {
                        tokens.unshift("LINE START");
                    } else if (tokens[0].startsWith("STRING ")) {
                        tokens[0] = tokens[0] + chars[i];
                    } else {
                        tokens.unshift("STRING " + chars[i]);
                    }
                    i += 1;
                    break;
                case "\t":
                    if (["LINEBREAK", "INDENT"].includes(tokens[0])) {
                        tokens.unshift("INDENT");
                    } else if (tokens[0].startsWith("STRING ")) {
                        tokens[0] = tokens[0] + chars[i];
                    } else {
                        tokens.unshift("STRING " + chars[i]);
                    }
                    i += 1;
                    break;
                case "[":
                    if (tokens[0] === "ASSET !") {
                        tokens[0] = "ASSET ![";
                    } else if (tokens[0] === "BI_LINK [") {
                        tokens[0] = "BI_LINK [[";
                    } else if (chars[i + 1] === "[") {
                        tokens.unshift("BI_LINK [");
                    } else if (!tokens.slice(0, 2).includes("QUOTE START")) {
                        tokens.unshift("LINK START");
                    } else if (tokens[0].startsWith("STRING ")) {
                        tokens[0] = tokens[0] + chars[i];
                    } else {
                        tokens.unshift("STRING " + chars[i]);
                    }
                    i += 1;
                    break;
                case "]":
                    if (
                        tokens[0] === "BI_LINK [[" ||
                        tokens[1] === "BI_LINK [["
                    ) {
                        tokens.unshift("BI_LINK ]");
                    } else if (
                        tokens[0] === "BI_LINK ]" ||
                        tokens[1] === "BI_LINK ]"
                    ) {
                        tokens[0] = "BI_LINK ]]";
                    } else if (
                        tokens[0] === "ASSET ![" ||
                        tokens[1] === "ASSET !["
                    ) {
                        tokens.unshift("ASSET ]");
                    } else if (
                        tokens[0] === "LINK [" ||
                        tokens[1] === "LINK ]"
                    ) {
                        tokens.unshift("LINK ]");
                    } else if (tokens[0].startsWith("STRING ")) {
                        tokens[0] = tokens[0] + chars[i];
                    } else {
                        tokens.unshift("STRING " + chars[i]);
                    }
                    i += 1;
                    break;
                case ":":
                    if (
                        tokens[0] === "LINE START" ||
                        tokens[0] === "LINEBREAK"
                    ) {
                        tokens.unshift("TAG FIELD :");
                    } else if (tokens[0] === "TAG FIELD :") {
                        tokens[0] = "TAG FIELD ::";
                    } else if (
                        tokens[0] === "TAG FIELD ::" ||
                        tokens[1] === "TAG FIELD ::"
                    ) {
                        tokens.unshift("TAG VALUE :");
                    } else if (tokens[0].startsWith("STRING ")) {
                        tokens[0] = tokens[0] + chars[i];
                    } else {
                        tokens.unshift("STRING " + chars[i]);
                    }
                    i += 1;
                    break;
                case ">":
                    if (tokens[0] === "LINE START" && chars[i + 1] === " ") {
                        tokens.unshift("QUOTE START");
                    } else if (tokens[0].startsWith("STRING ")) {
                        tokens[0] = tokens[0] + chars[i];
                    } else {
                        tokens.unshift("STRING " + chars[i]);
                    }
                    i += 1;
                    break;
                case "!":
                    if (
                        tokens[0] !== "QUOTE START" &&
                        tokens[1] !== "QUOTE START"
                    ) {
                        tokens.unshift("ASSET !");
                    } else if (tokens[0].startsWith("STRING ")) {
                        tokens[0] = tokens[0] + chars[i];
                    } else {
                        tokens.unshift("STRING " + chars[i]);
                    }
                    i += 1;
                    break;
                case "(":
                    if (tokens[0] === "ASSET ]" || tokens[1] === "ASSET ]") {
                        tokens.unshift("ASSET (");
                    } else if (
                        tokens[0] === "LINK ]" ||
                        tokens[1] === "LINK ]"
                    ) {
                        tokens.unshift("LINK (");
                    } else if (tokens[0].startsWith("STRING ")) {
                        tokens[0] = tokens[0] + chars[i];
                    } else {
                        tokens.unshift("STRING " + chars[i]);
                    }
                    i += 1;
                    break;
                case ")":
                    if (tokens[0] === "ASSET (" || tokens[1] === "ASSET (") {
                        tokens.unshift("ASSET )");
                    } else if (
                        tokens[0] === "LINK (" ||
                        tokens[1] === "LINK ("
                    ) {
                        tokens.unshift("LINK )");
                    } else if (tokens[0].startsWith("STRING ")) {
                        tokens[0] = tokens[0] + chars[i];
                    } else {
                        tokens.unshift("STRING " + chars[i]);
                    }
                    i += 1;
                    break;
                case "\n":
                    if (
                        chars[i + 1] === "\n" ||
                        chars[i + 1] === "\t" ||
                        chars[i + 1] === "-"
                    ) {
                        tokens.unshift("LINEBREAK");
                    } else if (
                        tokens[0] === "QUOTE START" ||
                        tokens[1] === "QUOTE START"
                    ) {
                        tokens[0] = tokens[0] + chars[i];
                    } else {
                        tokens.unshift("LINEBREAK");
                    }
                    i += 1;
                    break;
                default:
                    if (tokens[0].startsWith("STRING ")) {
                        tokens[0] = tokens[0] + chars[i];
                    } else if (chars[i].trim() !== "") {
                        tokens.unshift("STRING " + chars[i]);
                    }
                    i += 1;
                    break;
            }
        }
        return tokens.reverse();
    }
}

function test() {
    ASTree.parse(input);
}

test();
