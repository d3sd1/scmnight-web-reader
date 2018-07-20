import {JsonProperty, ICustomConverter} from 'json-typescript-mapper';
import {User} from './user';
import {EntranceType} from "./entrance-type";
import {ConflictReason} from "./conflict-reason";
import {PermissionList} from "./permission-list";

const dateConverter: ICustomConverter = {
  fromJson(data: any): any {
    return new Date(data);
  },

  toJson(data: any): any {
    return JSON.stringify(data);
  }
};

export class PermissionListManage {
  public user: User = null;
  public permission_list: PermissionList = null;
  @JsonProperty({customConverter: dateConverter})
  public date: Date = null;
  public type: EntranceType = null;
}
