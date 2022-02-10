import INFOQ_PRESET from "../data/infoq";
import USIDC_PRESET from "../data/usidc";
import _36KR_PRESET from "../data/_36kr";
import GCORES_PRESET from "../data/gcores";
import WOSHIPM_PRESET from "../data/woshipm";
import LEIPHONE_PRESET from "../data/leiphone";
import SSPAI_PRESET from "../data/sspai";
import THOUGHTWORKS_CN_PRESET from "../data/thoughworks_cn";
import GITHUB_PRESET from "../data/github";

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
