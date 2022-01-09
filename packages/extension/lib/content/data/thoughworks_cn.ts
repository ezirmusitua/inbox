const mode = {
  id: "thoughtworks_cn-preset",
  name: "ThoughtWorks 中国预设",
  url_pattern: ".*thoughtworks.cn/.*",
  removed: [{ selector: "entry .addtoany_content" }],
  reserved: [
    {
      new_selector: "",
      selector: ".entry .entry-title",
    },
    {
      new_selector: "",
      selector: ".entry .entry-meta",
    },
    {
      new_selector: "",
      selector: ".entry .entry-content",
    },
  ],
  css: [
    `.entry-title {
      font-size: 28px;
      font-weight: 700;
    }`,
  ],
};
export default mode;
