const mode = {
  id: "36kr-preset",
  name: "36 氪预设",
  url_pattern: ".*36kr.com/.*",
  removed: [],
  reserved: [
    {
      new_selector: "",
      selector: ".article-title",
    },
    {
      new_selector: "",
      selector: ".articleDetailContent",
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
