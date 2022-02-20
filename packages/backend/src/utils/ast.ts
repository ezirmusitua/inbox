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
  children?: iASTreeNode[];
  content?: string;
}

export class ASTree {
  static parse(source: string): iASTreeNode[] {
    const tokens = ASTree.scan(source);
    console.log(tokens);
    const forest = [];
    let prev = null;
    let current = null;
    let i = 0;
    while (i < tokens.length) {
      const token = tokens[i];
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
        // console.log("indent should change current to children");
        // console.log("next i and token: ", i, tokens[i]);
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
      console.log("level");
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
        console.log("level: ", level);
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
          if (tokens[0] === "BI_LINK [[" || tokens[1] === "BI_LINK [[") {
            tokens.unshift("BI_LINK ]");
          } else if (tokens[0] === "BI_LINK ]" || tokens[1] === "BI_LINK ]") {
            tokens[0] = "BI_LINK ]]";
          } else if (tokens[0] === "ASSET ![" || tokens[1] === "ASSET ![") {
            tokens.unshift("ASSET ]");
          } else if (tokens[0] === "LINK [" || tokens[1] === "LINK ]") {
            tokens.unshift("LINK ]");
          } else if (tokens[0].startsWith("STRING ")) {
            tokens[0] = tokens[0] + chars[i];
          } else {
            tokens.unshift("STRING " + chars[i]);
          }
          i += 1;
          break;
        case ":":
          if (tokens[0] === "LINE START" || tokens[0] === "LINEBREAK") {
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
          if (tokens[0] !== "QUOTE START" && tokens[1] !== "QUOTE START") {
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
          } else if (tokens[0] === "LINK ]" || tokens[1] === "LINK ]") {
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
          } else if (tokens[0] === "LINK (" || tokens[1] === "LINK (") {
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
