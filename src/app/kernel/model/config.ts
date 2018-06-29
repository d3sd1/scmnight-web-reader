export class Config {
  public config: string = null;
  public value: string = null;

  constructor(conf?: Config) {
    if (typeof conf !== "undefined") {
      this.config = conf.config;
      this.value = conf.value;
    }
  }
}
