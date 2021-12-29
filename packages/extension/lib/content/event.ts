import { iMsg } from "@logseq_inbox/shared";
import { ReadingMode } from "./reading_mode_rule";

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
    const reading_mode = new ReadingMode();
    reading_mode.apply({
      id: "uisdc sample",
      name: "uisdc",
      description: "uisdc",
      url_pattern: "https://uisdc.com/*",
      removed: [
        {
          selector: "div.post-header > div.container > h1 > span",
        },
      ],
      reserved: [
        {
          new_selector: "",
          selector: "div.post-header > div.container > h1",
        },
        {
          new_selector: "",
          selector:
            "div.post-content.line-numbers > div > div.container > div.post-article.uisdc-none > div.article",
        },
      ],
      css: [
        `h1 {
        font-size: 32px;
        padding-bottom: 24px;
      }`,
        `div.article img {
        margin: 0 auto;
        max-width: 640px;
      }
      `,
      ],
    });
  }
}
