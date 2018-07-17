import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TablePagedData} from "../model/table-paged-data";
import {TablePage} from "../model/table-page";
import {TableClientsMockResponse} from "../model/table-client-mockresponse";
import {ApiService} from "../services/api.service";

import {deserialize} from 'json-typescript-mapper';
import {ConflictReason} from "../model/conflict-reason";

@Injectable()
export class ConflictreasonsMock {
    constructor(private api: ApiService) {}

    public getTotalResults(page: TablePage): Observable<TablePagedData<ConflictReason>> {
      return this.api.post("rest/clients/table/conflictreasons", page).map(resp => this.getPagedConflictReasons(resp, page));
    }

    private getPagedConflictReasons(response: TableClientsMockResponse, page: TablePage): TablePagedData<ConflictReason> {
        let pagedData = new TablePagedData<ConflictReason>();
        page.totalElements = response.totalRows;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        page.pageNumber = response.pageNumber;
        for (let i = 0; i < response.data.length; i++) {
            let data = response.data[i];
          console.log(data);
            pagedData.data.push(deserialize(ConflictReason, data));
          console.log(pagedData.data);
        }
        pagedData.page = page;
        return pagedData;
    }

}
