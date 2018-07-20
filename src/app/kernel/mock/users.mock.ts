import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TablePagedData} from "../model/table-paged-data";
import {User} from "../model/user";
import {UserEntrance} from "../model/user-entrance";
import {TablePage} from "../model/table-page";
import {TableClientsMockResponse} from "../model/table-client-mockresponse";
import {ApiService} from "../services/api.service";

import {deserialize} from 'json-typescript-mapper';
import { map, filter, scan } from 'rxjs/operators';

@Injectable()
export class UsersMock {
    constructor(private api: ApiService) {}

    public getTotalResults(page: TablePage): Observable<TablePagedData<User>> {
      return this.api.post("rest/user/all/table", page).pipe(map(resp => this.getPagedUser(resp, page)));
    }

    public getRoomResults(page: TablePage): Observable<TablePagedData<UserEntrance>> {
      return this.api.post("rest/user/entrances/room/table", page).pipe(map(resp => this.getPagedUserEntrance(resp, page)));
    }

    public getHistoricalResults(page: TablePage): Observable<TablePagedData<UserEntrance>> {
      return this.api.post("rest/user/entrances/all/table", page).pipe(map(resp => this.getPagedUserEntrance(resp, page)));
    }

    private getPagedUser(response: TableClientsMockResponse, page: TablePage): TablePagedData<User> {
        let pagedData = new TablePagedData<User>();
        page.totalElements = response.totalRows;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        page.pageNumber = response.pageNumber;
        for (let i = 0; i < response.data.length; i++) {
            let data = response.data[i];
            pagedData.data.push(deserialize(User, data));
        }
        pagedData.page = page;
        return pagedData;
    }
    private getPagedUserEntrance(response: TableClientsMockResponse, page: TablePage): TablePagedData<UserEntrance> {
        let pagedData = new TablePagedData<UserEntrance>();
        page.totalElements = response.totalRows;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        page.pageNumber = response.pageNumber;
        for (let i = 0; i < response.data.length; i++) {
            let data = response.data[i];
            pagedData.data.push(deserialize(UserEntrance, data));
        }
        pagedData.page = page;
        return pagedData;
    }

}
