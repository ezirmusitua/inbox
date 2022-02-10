import { ReadingMode } from "./reading_mode";
import ReadingModeList from "./reading_mode_list";

const list = new ReadingModeList();
const reading_mode = new ReadingMode();

export default {
  load_available_mode() {
    try {
      return list.match_url();
    } catch (e) {
      console.log(e);
      return { items: [], total: 0 };
    }
  },

  use_reading_mode(mode: string) {
    try {
      const def = list.get_mode_def(mode);
      if (!def) return;
      reading_mode.apply(def);
    } catch (e) {
      console.log(e);
    }
  },

  send_to_inbox(mode: string) {
    try {
      const def = list.get_mode_def(mode);
      if (!def) return def;

      const url = window.location.href;
      const title = document.querySelector("title").innerText;
      const elem = reading_mode.generate_mode_view(def);
      const elem_cpy = elem.cloneNode();
      const mount = document.createElement("div");
      mount.appendChild(elem_cpy);
      const content = mount.innerHTML;
      mount.remove();
      fetch("http://localhost:31312/api/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title, content }),
      });
    } catch (e) {
      console.log(e);
    }
  },
};
