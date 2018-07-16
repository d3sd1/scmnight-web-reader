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
  public gender: Gender = new Gender();
  public name: string = null;
  public surname1: string = null;
  public surname2: string = null;
  @JsonProperty({customConverter: dateConverter})
  public birthdate: Date = null;
  public address: string = null;
  public email: string = null;
  public getProfileStatus() {
    let completeLevel:number = 0;
    const manualLevels = 4;
    this.address != null && this.address != "" ? completeLevel++:null;
    this.gender != null && this.gender.name != "" ? completeLevel++:null;
    this.email != null && this.email != "" ? completeLevel++:null;
    const percentageCompleted = completeLevel/manualLevels*100;
    let statusText = "NOT_COMPLETED";
    if(percentageCompleted <= 50)
    {
      statusText = "LOW_COMPLETED";
    }
    else if(percentageCompleted > 50 && percentageCompleted < 75) {
      statusText = "QUITE_COMPLETED";
    }
    else if(percentageCompleted >= 75 && percentageCompleted < 100) {
      statusText = "HIGH_COMPLETED";
    }
    else if(percentageCompleted == 100) {
      statusText = "FULL_COMPLETED";
    }
    return statusText;
  }
}
