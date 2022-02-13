const mode = {
  id: "woshipm-preset",
  name: "人人都是产品经理预设",
  url_pattern: ".*woshipm.com/.*",
  removed: [
    {
      selector: ".support-author",
    },
  ],
  reserved: [
    {
      new_selector: "",
      selector: ".article--title",
    },
    {
      new_selector: "",
      selector: ".article--content",
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
