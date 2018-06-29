import {ICustomConverter, JsonProperty} from "json-typescript-mapper";
import {Gender} from "./gender";

const dateConverter: ICustomConverter = {
  fromJson(data: any): any {
    return new Date(data);
  },

  toJson(data: any): any {
    return JSON.stringify(data);
  }
};

export class Client {
  public dni: number = null;
  public nationality: number = null;
  public gender: Gender = null;
  public name: string = null;
  public surname1: string = null;
  public surname2: string = null;
  @JsonProperty({customConverter: dateConverter})
  public birthdate: Date = null;
  public address: string = null;
  public email: string = null;
}
