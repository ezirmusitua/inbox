import { read } from "./components/fs";

class Service {
  constructor(private _connection?: chrome.runtime.Port) {}

  set connection(value: chrome.runtime.Port) {
    this._connection = value;
  }

  do_something() {
    this._connection?.postMessage({ type: "pop_event" });
  }
}

export default Service;
