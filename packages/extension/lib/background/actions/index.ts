import api from "../../domain/api";

export function action() {
  console.log("extension shared action");
}

export function make_snippet(url: string, title: string, selection: string) {
  return api.make_snippet(url, title, selection);
}
