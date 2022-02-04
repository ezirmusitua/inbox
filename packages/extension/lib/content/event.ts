import { iMsg } from "@inbox/shared";
import { ReadingMode } from "./domain/reading_mode";
import ReadingModeList from "./domain/reading_mode_list";

export class EventHandler {
  constructor(public _state: any = null) {}

  handle(msg: iMsg) {
    switch (msg.type) {
      case "use_reading_mode":
        return false;
      case "list_reading_mode":
        this.list_reading_mode();
        return "";
      default:
        return true;
    }
  }

  start_reading_mode() {
    const reading_mode = new ReadingMode();
    // reading_mode.apply();
  }

  list_reading_mode() {
    console.log("list reading mode");
    const list = new ReadingModeList();
    return list.match_url();
  }
}
