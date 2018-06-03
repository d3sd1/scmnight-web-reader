import {JsonProperty,ICustomConverter} from 'json-typescript-mapper';
import {User} from './user';
import {Config} from './config';
const dateConverter: ICustomConverter = {
    fromJson(data: any): any {
        return new Date(data);
    },

    toJson(data: any): any {
        return JSON.stringify(data);
    }
};
export class ConfigManage {
    public user: User = null;
    public target_config: Config = null;
    @JsonProperty({customConverter: dateConverter})
    public date: Date = null;
}