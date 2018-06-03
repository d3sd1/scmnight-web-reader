export class Config {
    public config: string = null;
    public value: string = null;
    constructor(conf?:Config)
    {
        this.config = conf.config;
        this.config = conf.value;
    }
}