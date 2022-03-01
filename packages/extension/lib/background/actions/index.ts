import api from "../../domain/api";

export function action() {
  console.log("extension shared action");
}

export function take_clip(url: string, title: string, selection: string) {
  return api.take_clip(url, title, selection);
}
