import {JsonProperty,ICustomConverter} from 'json-typescript-mapper';
import {User} from './user';
import {EntranceType} from "./entrance-type";
import {Rate} from "./rate";
const dateConverter: ICustomConverter = {
    fromJson(data: any): any {
        return new Date(data);
    },

    toJson(data: any): any {
        return JSON.stringify(data);
    }
};
export class RateManage {
    public user: User = null;
    public rate: Rate = null;
    @JsonProperty({customConverter: dateConverter})
    public date: Date = null;
  public type: EntranceType = null;
}
