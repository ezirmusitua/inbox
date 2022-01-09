const mode = {
  id: "uisdc-preset",
  name: "优设预设",
  url_pattern: ".*uisdc.com/.*",
  removed: [
    {
      selector: "div.post-header > div.container > h1 > span",
    },
  ],
  reserved: [
    {
      new_selector: "",
      selector: "div.post-header > div.container > h1",
    },
    {
      new_selector: "",
      selector:
        "div.post-content.line-numbers > div > div.container > div.post-article.uisdc-none > div.article",
    },
  ],
  css: [
    `h1 {
      font-size: 32px;
      padding-bottom: 24px;
    }`,
    `div.article img {
      margin: 0 auto;
      max-width: 640px;
    }`,
  ],
};
export default mode;
