enum eStateKey {
  STATE = "state",
}

interface iState {
  state: any;
}

export default class Repo {
  private _state: iState = { [eStateKey.STATE]: null };
  private _initialized = false;

  async init() {
    if (this._initialized) return;
    return new Promise((resolve) =>
      chrome.storage.sync.get(
        [eStateKey.STATE],
        (result: any) => {
          this._state.state = result[eStateKey.STATE];
          this._initialized = true;
          resolve(this._initialized);
        }
      )
    );
  }

  get initialized() {
    return this._initialized;
  }

  get state() {
    return this._state.state;
  }

  set state(value: any) {
    if (!value) {
      this._state.state = null as any;
      chrome.storage.sync.remove([eStateKey.STATE]);
    } else {
      this._state.state = value;
      chrome.storage.sync.set({ [eStateKey.STATE]: this._state.state });
    }
  }
}
