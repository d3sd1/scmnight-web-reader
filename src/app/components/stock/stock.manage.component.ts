import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {WsService} from '../../kernel/services/ws.service';
import {TablePage} from '../../kernel/model/table-page';
import {User} from '../../kernel/model/user';
import {UsersMock} from '../../kernel/mock/users.mock';
import {ApiService} from '../../kernel/services/api.service';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {MzModalComponent} from "ngx-materialize";
import {StockItem} from "../../kernel/model/stock-item";
import {deserialize} from "json-typescript-mapper";
import {StockItemManage} from "../../kernel/model/stock-item-manage";
import { map, filter, catchError, mergeMap, finalize } from 'rxjs/operators';
import {StockItemsMock} from "../../kernel/mock/stock-items.mock";

@Component({
  templateUrl: '../../templates/stock.manage.component.html',
  providers: [
    StockItemsMock
  ],
})

export class StockManageComponent implements OnInit, AfterViewInit, OnDestroy {
  page = new TablePage();
  rows = new Array<StockItem>();
  loading: boolean = false;
  @ViewChild('StockItemEditModal') StockItemEditModal: MzModalComponent;
  @ViewChild('StockItemDelModal') StockItemDelModal: MzModalComponent;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
  };

  constructor(private serverResultsService: StockItemsMock, private ws: WsService, private api: ApiService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  /* Manage user */
  modalStockItem: StockItem = new StockItem();
  editTypeAdd: boolean = false;

  addUserModal() {
    this.modalStockItem = new StockItem();
    this.editTypeAdd = true;
    this.StockItemEditModal.openModal();
  }

  editUserModal(StockItem: StockItem) {
    this.modalStockItem = StockItem;
    this.editTypeAdd = false;
    this.StockItemEditModal.openModal();
  }

  editUserRest() {
    let call;
    if (this.editTypeAdd) {
      call = this.api.put("rest/clients/StockItem", this.modalStockItem);
    }
    else {
      call = this.api.post("rest/clients/StockItem", this.modalStockItem);
    }

    call.pipe(finalize(() => {
      this.StockItemEditModal.closeModal();
    })).subscribe();
  }

  delUserModal(StockItem: StockItem) {
    this.modalStockItem = StockItem;
    this.StockItemDelModal.openModal();
  }

  delUserRest() {
    this.api.del("rest/clients/StockItem/" + this.modalStockItem.id)
      .pipe(finalize(() => {
        this.StockItemDelModal.closeModal();
      }))
      .subscribe();
  }

  ngOnInit(): void {
    this.loading = true;
    this.setPage({offset: 0});
  }

  ngOnDestroy(): void {
    this.ws.unsubscribe("scm/StockItems_manage");
  }

  ngAfterViewInit() {
    this.ws.subscribe("scm/StockItems_manage", this.onStockItemManage.bind(this));
  }

  private onStockItemManage(uri: any, data: any) {
    let action: StockItemManage = deserialize(StockItemManage, JSON.parse(data)),
      StockItemIndex: number = this.rows.findIndex(x =>  x.id === action.item.id);
    switch (action.type.name) {
      case "ADD":
        this.rows.push(action.item);
        this.page.totalElements++;
        break;
      case "DELETE":
        this.rows.splice(StockItemIndex, 1);
        this.page.totalElements--;
        break;
      case "EDIT":
        this.rows[StockItemIndex] = action.item;
        break;
    }
  }

  setPage(pageInfo) {
    if (pageInfo.offset !== false) {
      this.page.pageNumber = pageInfo.offset;
    }
    if (pageInfo.order) {
      this.page.order["col"] = pageInfo.order.col;
      this.page.order["dir"] = pageInfo.order.dir;
    }
    if (pageInfo.search) {
      this.page.search = pageInfo.search;
    }
    else {
      this.page.search = pageInfo.search;
    }
    this.serverResultsService.getTotalResults(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      this.loading = false;
    });
  }

  setRows(event: Object) {
    this.page.size = parseInt(event["target"]["value"]);
    this.setPage({});
  }

  onSort(event) {
    this.loading = true;
    this.setPage({
      offset: 0,
      order: {
        col: event.sorts[0].prop,
        dir: event.sorts[0].dir
      }
    });
  }

  onSearch(event) {
    this.loading = true;
    this.setPage({
      offset: 0,
      search: event.target.value.toLowerCase()
    });
  }

}
