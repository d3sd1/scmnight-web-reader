import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TablePagedData} from "../model/table-paged-data";
import {ClientEntrance} from "../model/client-entrance";
import {TablePage} from "../model/table-page";
import {TableClientsMockResponse} from "../model/table-client-mockresponse";
import {ApiService} from "../services/api.service";


import {deserialize} from 'json-typescript-mapper';

@Injectable()
export class ClientsMock {
    constructor(private api:ApiService){}
    
    public getTotalResults(page: TablePage): Observable<TablePagedData<ClientEntrance>> {
        return this.api.post("clients/table/all",page).map(resp => this.getPagedData(resp,page));
    }
    
    public getRoomResults(page: TablePage): Observable<TablePagedData<ClientEntrance>> {
        return this.api.post("clients/table/room",page).map(resp => this.getPagedData(resp,page));
    }

    private getPagedData(response:TableClientsMockResponse, page: TablePage): TablePagedData<ClientEntrance> {
        let pagedData = new TablePagedData<ClientEntrance>();
        page.totalElements = response.totalRows;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        page.pageNumber = response.pageNumber;
        for (let i = 0; i < response.data.length; i++){
            let data = response.data[i];
            pagedData.data.push(deserialize(ClientEntrance, data));
        }
        pagedData.page = page;
        return pagedData;
    }

}