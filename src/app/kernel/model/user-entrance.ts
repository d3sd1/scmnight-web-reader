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

export class UserEntrance {
    id: string = null;
    user: User = null;
    @JsonProperty({customConverter: dateConverter})
    date: Date = null;
    type: string = null;
}