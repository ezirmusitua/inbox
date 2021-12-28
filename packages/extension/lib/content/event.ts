import { iMsg } from "@logseq_inbox/shared";

export class EventHandler {
  constructor(public _state: any = null) {}

  handle(msg: iMsg) {
    switch (msg.type) {
      case "start_reading_mode":
        this.start_reading_mode();
        return false;
      default:
        return true;
    }
  }

  start_reading_mode() {
    // uisdc article reading mode
    const content = document.querySelector(
      "body > div.post-content.line-numbers > div > div.container > div.post-article.uisdc-none > div.article"
    );
    if (!content) {
      console.log("us failed");
      return;
    }
    document
      .querySelectorAll(
        "body > div.post-content.line-numbers > div > div.container > div.post-article.uisdc-none > div.article img"
      )
      .forEach((el: any) => {
        el.style.margin = "0 auto";
        el.style.maxWidth = "640px";
      });
    const header = document.querySelector(
      "body > div.post-header > div.container > h1"
    ) as any;
    header.style.fontSize = "32px";
    header.style.paddingBottom = "24px";
    const fav_btn = document.querySelector(
      "body > div.post-header > div.container > h1 > span"
    ) as any;
    fav_btn.remove();
    const body = document.querySelector("body");
    if (!body) {
      console.log("body failed");
      return;
    }
    const section = document.createElement("section");
    section.style.padding = "32px";
    section.append(header);
    section.append(content);
    body.append(section);
    body.style.paddingTop = "0px";
    document.querySelectorAll("body > div").forEach((el: any) => el.remove(el));
    console.log("try to start reading mode");
  }
}
