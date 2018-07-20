import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {WsService} from '../../kernel/services/ws.service';
import {TablePage} from '../../kernel/model/table-page';
import {ApiService} from '../../kernel/services/api.service';
import {MzModalComponent} from "ngx-materialize";
import {deserialize} from "json-typescript-mapper";
import {RatesMock} from "../../kernel/mock/rates.mock";
import {Rate} from "../../kernel/model/rate";
import {RateManage} from "../../kernel/model/rate-manage";
import { map, filter, catchError, mergeMap, finalize } from 'rxjs/operators';

@Component({
  templateUrl: '../../templates/rates.manage.component.html',
  providers: [
    RatesMock
  ],
})

export class RatesManageComponent implements OnInit, AfterViewInit, OnDestroy {
  page = new TablePage();
  rows = new Array<Rate>();
  loading: boolean = false;
  @ViewChild('rateEditModal') rateEditModal: MzModalComponent;
  @ViewChild('rateDelModal') rateDelModal: MzModalComponent;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
  };

  constructor(private serverResultsService: RatesMock, private ws: WsService, private api: ApiService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  /* Manage user */
  modalRate: Rate = new Rate();
  editTypeAdd: boolean = false;

  addUserModal() {
    this.modalRate = new Rate();
    this.editTypeAdd = true;
    this.rateEditModal.openModal();
  }

  editUserModal(rate: Rate) {
    this.modalRate = rate;
    this.editTypeAdd = false;
    this.rateEditModal.openModal();
  }

  editUserRest() {
    let call;
    if (this.editTypeAdd) {
      call = this.api.put("rest/crud/rate", this.modalRate);
    }
    else {
      call = this.api.post("rest/crud/rate", this.modalRate);
    }

    call.pipe(finalize(() => {
      this.rateEditModal.closeModal();
    })).subscribe();
  }

  delUserModal(rate: Rate) {
    this.modalRate = rate;
    this.rateDelModal.openModal();
  }

  delUserRest() {
    this.api.del("rest/crud/rate/" + this.modalRate.id)
      .pipe(finalize(() => {
        this.rateDelModal.closeModal();
      }))
      .subscribe();
  }

  ngOnInit(): void {
    this.loading = true;
    this.setPage({offset: 0});
  }

  ngOnDestroy(): void {
    this.ws.unsubscribe("scm/rates_manage");
  }

  ngAfterViewInit() {
    this.ws.subscribe("scm/rates_manage", this.onRateManage.bind(this));
  }

  private onRateManage(uri: any, data: any) {
    let action: RateManage = deserialize(RateManage, JSON.parse(data)),
      rateReasonIndex: number = this.rows.findIndex(x =>  x.id === action.rate.id);
    switch (action.type.name) {
      case "ADD":
        this.rows.push(action.rate);
        this.page.totalElements++;
        break;
      case "DELETE":
        this.rows.splice(rateReasonIndex, 1);
        this.page.totalElements--;
        break;
      case "EDIT":
        this.rows[rateReasonIndex] = action.rate;
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
