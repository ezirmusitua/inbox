import INFOQ_PRESET from "./preset/infoq";
import USIDC_PRESET from "./preset/usidc";
import _36KR_PRESET from "./preset/_36kr";
import GCORES_PRESET from "./preset/gcores";
import WOSHIPM_PRESET from "./preset/woshipm";
import LEIPHONE_PRESET from "./preset/leiphone";
import SSPAI_PRESET from "./preset/sspai";
import THOUGHTWORKS_CN_PRESET from "./preset/thoughworks_cn";
import GITHUB_PRESET from "./preset/github";

export default class ReadingModeList {
  private readonly _list = [
    INFOQ_PRESET,
    USIDC_PRESET,
    _36KR_PRESET,
    GCORES_PRESET,
    WOSHIPM_PRESET,
    LEIPHONE_PRESET,
    SSPAI_PRESET,
    THOUGHTWORKS_CN_PRESET,
    GITHUB_PRESET,
  ];

  match_url() {
    const href = window.location.href;
    const items = this._list.filter((item) =>
      new RegExp(item.url_pattern, "i").test(href)
    );
    return { items, total: items.length };
  }

  get_mode_def(mode: string) {
    return this._list.find((item) => item.id === mode);
  }
}
