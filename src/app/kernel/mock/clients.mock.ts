import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TablePagedData} from "../model/table-paged-data";
import {ClientEntrance} from "../model/client-entrance";
import {TablePage} from "../model/table-page";
import {TableClientsMockResponse} from "../model/table-client-mockresponse";
import {ApiService} from "../services/api.service";


import {deserialize} from 'json-typescript-mapper';
import {Client} from "../model/client";
import { map, filter, scan } from 'rxjs/operators';

@Injectable()
export class ClientsMock {
  constructor(private api: ApiService) {
  }

  public getTotalResults(page: TablePage): Observable<TablePagedData<ClientEntrance>> {
    return this.api.post("rest/client/entrances/all/table", page).pipe(map(resp => this.getPagedData(resp, page)));
  }

  public getConflictiveResults(page: TablePage): Observable<TablePagedData<Client>> {
    return this.api.post("rest/conflictive/clients/table", page).pipe(map(resp => this.getPagedConflictives(resp, page)));
  }

  public getRoomResults(page: TablePage): Observable<TablePagedData<ClientEntrance>> {
    return this.api.post("rest/client/entrances/room/table", page).pipe(map(resp => this.getPagedData(resp, page)));
  }

  private getPagedData(response: TableClientsMockResponse, page: TablePage): TablePagedData<ClientEntrance> {
    let pagedData = new TablePagedData<ClientEntrance>();
    page.totalElements = response.totalRows;
    page.totalPages = Math.ceil(page.totalElements / page.size);
    page.pageNumber = response.pageNumber;
    for (let i = 0; i < response.data.length; i++) {
      let data = response.data[i];
      pagedData.data.push(deserialize(ClientEntrance, data));
    }
    pagedData.page = page;
    return pagedData;
  }

  private getPagedConflictives(response: TableClientsMockResponse, page: TablePage): TablePagedData<Client> {
    let pagedData = new TablePagedData<Client>();
    page.totalElements = response.totalRows;
    page.totalPages = Math.ceil(page.totalElements / page.size);
    page.pageNumber = response.pageNumber;
    for (let i = 0; i < response.data.length; i++) {
      let data = response.data[i];
      pagedData.data.push(deserialize(Client, data));
    }
    pagedData.page = page;
    return pagedData;
  }

}
