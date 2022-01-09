const mode = {
  id: "github-preset",
  name: "Github 预设",
  url_pattern: ".*github.com/.*",
  removed: [],
  reserved: [
    {
      new_selector: "",
      selector: "#readme > div.Box-body.px-5.pb-5",
    },
  ],
  css: [],
};
export default mode;
