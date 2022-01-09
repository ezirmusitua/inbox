const mode = {
  id: "sspai-preset",
  name: "少数派预设",
  url_pattern: ".*sspai.com/.*",
  removed: [],
  reserved: [
    {
      new_selector: "",
      selector: "#article-title",
    },
    {
      new_selector: "",
      selector: "div.content.wangEditor-txt.minHeight",
    },
  ],
  css: [
    `#article-title {
      font-size: 28px;
      font-weight: 700;
    }`,
  ],
};
export default mode;
