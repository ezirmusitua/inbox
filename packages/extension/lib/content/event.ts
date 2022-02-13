import { iMsg } from "@inbox/shared";

export class EventHandler {
  constructor(public _state: any = null) {}

  handle(msg: iMsg) {
    switch (msg.type) {
      case "use_reading_mode":
        return false;
      case "list_reading_mode":
        return false;
      default:
        return true;
    }
  }

  start_reading_mode() {
    // reading_mode.apply();
  }

  list_reading_mode() {}
}
