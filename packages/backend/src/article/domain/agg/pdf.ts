import puppeteer from "puppeteer";

export class Printer {
  static instance: Printer;
  private browser: puppeteer.Browser;
  private page: puppeteer.Page;
  private _initialized = false;

  constructor(private readonly browser_bin: string) {
    if (!Printer.instance) {
      Printer.instance = this;
    }
  }

  async initialize() {
    if (this._initialized) return;
    // TODO: make executable path configurable
    this.browser = await puppeteer.launch({
      headless: true,
      executablePath: this.browser_bin,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    this.page = await this.browser.newPage();
    this._initialized = true;
  }

  async print_pdf(html: string) {
    await this.initialize();
    await this.page.setContent(html);
    return this.page.pdf({ format: "a4" });
  }

  async destroy() {
    if (!this._initialized) return;
    await this.page.close();
    await this.browser.close();
    this._initialized = false;
  }

  static get_instance() {
    if (!Printer.instance) throw new Error("Printer is not initialized");
    return Printer.instance;
  }
}

export class Pdf {
  private _pdf_buffer: Buffer;
  private _printer = Printer.get_instance();
  constructor(private content: string) {}

  async generate() {
    console.log("generating pdf...");
    console.debug(this.content);
    if (!this._pdf_buffer) {
      this._pdf_buffer = await this._printer.print_pdf(this.content);
      console.log(this._pdf_buffer);
    }
    return this._pdf_buffer;
  }
}
