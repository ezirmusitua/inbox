const mode = {
  id: "infoq-preset",
  name: "InfoQ 预设",
  url_pattern: ".*infoq.cn/.*",
  removed: [],
  reserved: [
    {
      new_selector: "",
      selector: ".article-title",
    },
    {
      new_selector: "",
      selector: ".content-preview",
    },
  ],
  css: [],
};
export default mode;
