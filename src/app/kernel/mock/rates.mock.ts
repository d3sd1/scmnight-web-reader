import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TablePagedData} from "../model/table-paged-data";
import {TablePage} from "../model/table-page";
import {TableClientsMockResponse} from "../model/table-client-mockresponse";
import {ApiService} from "../services/api.service";

import {deserialize} from 'json-typescript-mapper';
import {Rate} from "../model/rate";

@Injectable()
export class RatesMock {
    constructor(private api: ApiService) {}

    public getTotalResults(page: TablePage): Observable<TablePagedData<Rate>> {
      return this.api.post("rest/clients/table/rates", page).map(resp => this.getPagedRates(resp, page));
    }

    private getPagedRates(response: TableClientsMockResponse, page: TablePage): TablePagedData<Rate> {
        let pagedData = new TablePagedData<Rate>();
        page.totalElements = response.totalRows;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        page.pageNumber = response.pageNumber;
        for (let i = 0; i < response.data.length; i++) {
            let data = response.data[i];
            pagedData.data.push(deserialize(Rate, data));
          console.log(pagedData.data);
        }
        pagedData.page = page;
        return pagedData;
    }

}
