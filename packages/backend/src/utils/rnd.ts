export class RndStrGenerator {
  private _used = new Set<string>();

  constructor(
    used: string[],
    private readonly len = 6,
    private charset = "abcdefghijklmnopqrstuvwxyz_".split(""),
  ) {
    this._used = new Set(used);
  }

  get() {
    let out = "";
    while (out.length < this.len) {
      out += this.charset[Math.floor(Math.random() * this.charset.length)];
    }
    if (!this._used.has(out)) {
      return out;
    }
    this._used.add(out);
    return this.get();
  }
}
