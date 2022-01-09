const mode = {
  id: "leiphone-preset",
  name: "雷锋网预设",
  url_pattern: ".*leiphone.com/.*",
  removed: [
    {
      selector: ".support-author",
    },
  ],
  reserved: [
    {
      new_selector: "",
      selector: ".headTit",
    },
    {
      new_selector: "",
      selector: ".lph-article-comView",
    },
  ],
  css: [
    `h1 {
      font-size: 28px;
      font-weight: 700;
    }`,
  ],
};
export default mode;
