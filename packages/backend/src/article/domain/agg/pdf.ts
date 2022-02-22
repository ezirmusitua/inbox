import puppeteer from "puppeteer-core";

export class Printer {
  static instance: Printer;
  private browser: puppeteer.Browser;
  private _initialized = false;

  constructor(private readonly browser_bin: string) {
    if (!Printer.instance) {
      Printer.instance = this;
    }
  }

  async initialize() {
    if (this._initialized) return;
    this.browser = await puppeteer.launch({
      headless: true,
      executablePath: this.browser_bin,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    this._initialized = true;
  }

  async print_pdf(html: string) {
    await this.initialize();

    const page = await this.browser.newPage();
    await page.setContent(html);
    const buffer = await page.pdf({ format: "a4" });
    await page.close();
    return buffer;
  }

  async destroy() {
    if (!this._initialized) return;
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
    if (!this._pdf_buffer) {
      this._pdf_buffer = await this._printer.print_pdf(this.content);
    }
    return this._pdf_buffer;
  }
}
