import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {WsService} from '../../kernel/services/ws.service';
import {TablePage} from '../../kernel/model/table-page';
import {User} from '../../kernel/model/user';
import {UsersMock} from '../../kernel/mock/users.mock';
import {ApiService} from '../../kernel/services/api.service';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {MzModalComponent} from "ngx-materialize";
import {ConflictreasonsMock} from "../../kernel/mock/conflictreasons.mock";
import {ConflictReason} from "../../kernel/model/conflict-reason";
import {deserialize} from "json-typescript-mapper";
import {ConflictReasonManage} from "../../kernel/model/conflict-reason-manage";
import { map, filter, catchError, mergeMap, finalize } from 'rxjs/operators';

@Component({
  templateUrl: '../../templates/conflictreasons.manage.component.html',
  providers: [
    ConflictreasonsMock
  ],
})

export class ConflictreasonsManageComponent implements OnInit, AfterViewInit, OnDestroy {
  page = new TablePage();
  rows = new Array<ConflictReason>();
  loading: boolean = false;
  @ViewChild('conflictReasonEditModal') conflictReasonEditModal: MzModalComponent;
  @ViewChild('conflictReasonDelModal') conflictReasonDelModal: MzModalComponent;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
  };

  constructor(private serverResultsService: ConflictreasonsMock, private ws: WsService, private api: ApiService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  /* Manage user */
  modalConflictReason: ConflictReason = new ConflictReason();
  editTypeAdd: boolean = false;

  addUserModal() {
    this.modalConflictReason = new ConflictReason();
    this.editTypeAdd = true;
    this.conflictReasonEditModal.openModal();
  }

  editUserModal(conflictReason: ConflictReason) {
    this.modalConflictReason = conflictReason;
    this.editTypeAdd = false;
    this.conflictReasonEditModal.openModal();
  }

  editUserRest() {
    let call;
    if (this.editTypeAdd) {
      call = this.api.put("rest/clients/conflictreason", this.modalConflictReason);
    }
    else {
      call = this.api.post("rest/clients/conflictreason", this.modalConflictReason);
    }

    call.pipe(finalize(() => {
      this.conflictReasonEditModal.closeModal();
    })).subscribe();
  }

  delUserModal(conflictReason: ConflictReason) {
    this.modalConflictReason = conflictReason;
    this.conflictReasonDelModal.openModal();
  }

  delUserRest() {
    this.api.del("rest/clients/conflictreason/" + this.modalConflictReason.id)
      .pipe(finalize(() => {
        this.conflictReasonDelModal.closeModal();
      }))
      .subscribe();
  }

  ngOnInit(): void {
    this.loading = true;
    this.setPage({offset: 0});
  }

  ngOnDestroy(): void {
    this.ws.unsubscribe("scm/conflictreasons_manage");
  }

  ngAfterViewInit() {
    this.ws.subscribe("scm/conflictreasons_manage", this.onConflictReasonManage.bind(this));
  }

  private onConflictReasonManage(uri: any, data: any) {
    let action: ConflictReasonManage = deserialize(ConflictReasonManage, JSON.parse(data)),
      conflictReasonIndex: number = this.rows.findIndex(x =>  x.id === action.conflict_reason.id);
    switch (action.type.name) {
      case "ADD":
        this.rows.push(action.conflict_reason);
        this.page.totalElements++;
        break;
      case "DELETE":
        this.rows.splice(conflictReasonIndex, 1);
        this.page.totalElements--;
        break;
      case "EDIT":
        this.rows[conflictReasonIndex] = action.conflict_reason;
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
