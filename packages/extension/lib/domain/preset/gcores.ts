const mode = {
  id: "gcores-preset",
  name: "机核预设",
  url_pattern: ".*gcores.com/.*",
  removed: [],
  reserved: [
    {
      new_selector: "",
      selector: ".originalPage_title",
    },
    {
      new_selector: "",
      selector: ".story-show",
    },
  ],
  css: [],
};
export default mode;
