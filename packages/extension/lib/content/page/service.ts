export default class Service {
  static instance = null as any;
  private _api = {} as any;
  constructor() {
    if (!Service.instance) {
      Service.instance = this;
    }
    return Service.instance;
  }

  set_api(api: Record<string, any>) {
    this._api = api;
  }

  validate_api(name: string) {
    if (!this._api[name]) {
      const msg = `api:${name} not found`;
      console.log(msg);
      throw new Error(msg);
    }
  }

  load_available_mode() {
    this.validate_api("load_available_mode");
    return this._api.load_available_mode();
  }

  use_reading_mode(mode: string) {
    this.validate_api("use_reading_mode");
    return this._api.use_reading_mode(mode);
  }
}
