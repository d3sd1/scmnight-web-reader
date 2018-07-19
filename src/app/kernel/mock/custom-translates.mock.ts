import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TablePagedData} from "../model/table-paged-data";
import {TablePage} from "../model/table-page";
import {TableClientsMockResponse} from "../model/table-client-mockresponse";
import {ApiService} from "../services/api.service";

import {deserialize} from 'json-typescript-mapper';
import {ConflictReason} from "../model/conflict-reason";
import {map, filter, scan} from 'rxjs/operators';
import {StockItem} from "../model/stock-item";
import {CustomTranslate} from "../model/custom-translate";

@Injectable()
export class CustomTranslatesMock {
  constructor(private api: ApiService) {
  }

  public getTotalResults(page: TablePage): Observable<TablePagedData<CustomTranslate>> {
    return this.api.post("rest/sessiondata/crud/translates", page).pipe(map(resp => this.getPagedConflictReasons(resp, page)));
  }

  private getPagedConflictReasons(response: TableClientsMockResponse, page: TablePage): TablePagedData<CustomTranslate> {
    let pagedData = new TablePagedData<CustomTranslate>();
    page.totalElements = response.totalRows;
    page.totalPages = Math.ceil(page.totalElements / page.size);
    page.pageNumber = response.pageNumber;
    for (let i = 0; i < response.data.length; i++) {
      let data = response.data[i];
      pagedData.data.push(deserialize(CustomTranslate, data));
    }
    pagedData.page = page;
    return pagedData;
  }

}
