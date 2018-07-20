import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TablePagedData} from "../model/table-paged-data";
import {Config} from "../model/config";
import {TablePage} from "../model/table-page";
import {TableClientsMockResponse} from "../model/table-client-mockresponse";
import {ApiService} from "../services/api.service";
import {deserialize} from 'json-typescript-mapper';
import { map, filter, scan } from 'rxjs/operators';

@Injectable()
export class ConfigMock {
    constructor(private api: ApiService) {}
    public getAllConfigs(page: TablePage): Observable<TablePagedData<Config>> {
      return this.api.post("rest/config/table", page).pipe(map(resp => this.getPagedConfigs(resp, page)));
    }

    private getPagedConfigs(response: TableClientsMockResponse, page: TablePage): TablePagedData<Config> {
        let pagedData = new TablePagedData<Config>();
        page.totalElements = response.totalRows;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        page.pageNumber = response.pageNumber;
        for (let i = 0; i < response.data.length; i++) {
            let data = response.data[i];
            pagedData.data.push(deserialize(Config, data));
        }
        pagedData.page = page;
        return pagedData;
    }

}
