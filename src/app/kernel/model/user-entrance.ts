import {JsonProperty,ICustomConverter} from 'json-typescript-mapper';
import {User} from './user';
import {EntranceType} from "./entrance-type";
const dateConverter: ICustomConverter = {
    fromJson(data: any): any {
        return new Date(data);
    },

    toJson(data: any): any {
        return JSON.stringify(data);
    }
};

export class UserEntrance {
  id: number = null;
    user: User = null;
    @JsonProperty({customConverter: dateConverter})
    date: Date = null;
  type: EntranceType = null;
}
