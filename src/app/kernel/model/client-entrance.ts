import {JsonProperty,ICustomConverter} from 'json-typescript-mapper';
import {User} from './user';
import {EntranceType} from "./entrance-type";
import {Client} from "./client";
const dateConverter: ICustomConverter = {
    fromJson(data: any): any {
        return new Date(data);
    },

    toJson(data: any): any {
        return JSON.stringify(data);
    }
};

export class ClientEntrance {
    id: string = null;
  client: Client = null;
    @JsonProperty({customConverter: dateConverter})
    date: Date = null;
    vip: string = null;
  type: EntranceType = null;
}
