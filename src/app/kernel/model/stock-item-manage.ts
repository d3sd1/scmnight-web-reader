import {JsonProperty, ICustomConverter} from 'json-typescript-mapper';
import {User} from './user';
import {EntranceType} from "./entrance-type";
import {ConflictReason} from "./conflict-reason";
import {StockItem} from "./stock-item";

const dateConverter: ICustomConverter = {
  fromJson(data: any): any {
    return new Date(data);
  },

  toJson(data: any): any {
    return JSON.stringify(data);
  }
};

export class StockItemManage {
  public user: User = null;
  public item: StockItem = null;
  @JsonProperty({customConverter: dateConverter})
  public date: Date = null;
  public type: EntranceType = null;
}
