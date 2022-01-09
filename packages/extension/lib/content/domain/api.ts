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
      if (def) {
        reading_mode.apply(def);
      }
    } catch (e) {
      console.log(e);
    }
  },
};
