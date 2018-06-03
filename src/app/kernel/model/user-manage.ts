import {JsonProperty,ICustomConverter} from 'json-typescript-mapper';
import {User} from './user';
const dateConverter: ICustomConverter = {
    fromJson(data: any): any {
        return new Date(data);
    },

    toJson(data: any): any {
        return JSON.stringify(data);
    }
};
export class UserManage {
    public user: User = null;
    public target_user: User = null;
    @JsonProperty({customConverter: dateConverter})
    public date: Date = null;
    public type: string = null;
}