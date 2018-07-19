import {TablePage} from "../model/table-page";
import {ConflictReason} from "../model/conflict-reason";
import {deserialize} from "json-typescript-mapper";
import {finalize, map} from "rxjs/operators";
import {ConflictReasonManage} from "../model/conflict-reason-manage";
import {ViewChild} from "@angular/core";
import {MzModalComponent} from "ngx-materialize";
import {User} from "../model/user";
import {Crud, NoParamConstructor} from "./Crud";
import {TableClientsMockResponse} from "../model/table-client-mockresponse";
import {TablePagedData} from "../model/table-paged-data";
import {Observable} from "rxjs/index";
import {ApiService} from "../services/api.service";
import {WsService} from "../services/ws.service";

export abstract class CommonCrud<T, N> implements Crud {


  /*
  -------------------------------------
  BEGIN PARAMS
  -------------------------------------
   */

  /* Parámetros configurables */
  protected abstract PAGE_NAME: string;
  protected abstract WS_CHANNEL: string;
  protected abstract REST_URL: string;
  protected abstract DATA_PK: any;
  protected abstract MANAGE_FIELD: any;
  protected abstract TRANSLATE_FIELD: any;

  /* Parámetros de la tabla */
  public loading: boolean = false;
  public page = new TablePage();
  public rows = new Array<T>();
  private REST_BASE_URL = "rest/crud/";

  /* TypeToken */
  private typeTokenBaseClass;
  private typeTokenManageClass;

  /* Modales y CRUD */
  protected userInfo: User = new User();
  protected editTypeAdd: boolean = false;
  public modalData: T;
  @ViewChild('manageModal') manageModal: MzModalComponent;
  @ViewChild('delModal') delModal: MzModalComponent;
  public modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
  };

  /*
  -------------------------------------
  BEGIN CODE
  -------------------------------------
   */

  constructor(protected api: ApiService, protected ws: WsService, typeTokenBaseClass: NoParamConstructor<T>, typeTokenManageClass: NoParamConstructor<N>) {
    this.typeTokenBaseClass = typeTokenBaseClass;
    this.typeTokenManageClass = typeTokenManageClass;
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.modalData = this.typeTokenBaseClass;
  }

  /*
  * Table data.
  */
  public getTotalResults(page: TablePage): Observable<TablePagedData<T>> {
    return this.api.post(this.REST_BASE_URL + this.REST_URL + "/table", page).pipe(map(resp => this.getTableData(resp, page)));
  }

  private getTableData(response: TableClientsMockResponse, page: TablePage): TablePagedData<T> {
    let pagedData = new TablePagedData<T>();
    page.totalElements = response.totalRows;
    page.totalPages = Math.ceil(page.totalElements / page.size);
    page.pageNumber = response.pageNumber;

    for (let i = 0; i < response.data.length; i++) {
      let data = response.data[i];
      pagedData.data.push(deserialize(this.typeTokenBaseClass, data));
    }
    pagedData.page = page;
    return pagedData;
  }

  /*
  Table actions
   */
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
    this.getTotalResults(this.page).subscribe(pagedData => {
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

  /* Modal actions */
  abstract hookOpenAddModal();
  abstract hookAfterAddRestCall();
  abstract hookAfterEditRestCall();
  abstract hookAfterDelRestCall();

  openAddModal() {
    this.modalData = this.typeTokenBaseClass;
    this.editTypeAdd = true;
    this.hookOpenAddModal();
    this.manageModal.openModal();
  }

  abstract hookOpenEditModal();

  openEditModal(stuff: T) {
    this.modalData = stuff;
    this.editTypeAdd = false;
    this.hookOpenEditModal();
    this.manageModal.openModal();
  }

  editUserRest() {
    if (this.editTypeAdd) {
      this.api.put(this.REST_BASE_URL + this.REST_URL, this.modalData).pipe(finalize(() => {
        this.manageModal.closeModal();
      })).subscribe();
      this.hookAfterAddRestCall();
    }
    else {
      this.hookAfterEditRestCall();
    }
  }

  openDelModal(conflictReason: T) {
    this.modalData = conflictReason;
    this.delModal.openModal();
  }

  delUserRest() {
    this.api.del(this.REST_BASE_URL + this.REST_URL + "/" + this.modalData[this.DATA_PK])
      .pipe(finalize(() => {
        this.delModal.closeModal();
      }))
      .subscribe();
    this.hookAfterDelRestCall();
  }


  hookOnViewInit() {

  }

  abstract hookOnCrudInit();

  hookOnInit() {
    this.loading = true;
    this.setPage({offset: 0});
    this.ws.subscribe(this.WS_CHANNEL, this.onWsUpdate.bind(this));
    this.hookOnCrudInit();
  }

  hookOnDestroy() {
    this.ws.unsubscribe(this.WS_CHANNEL);
  }

  private onWsUpdate(uri: any, data: any) {
    let action: N = deserialize(this.typeTokenManageClass, JSON.parse(data)),
      conflictReasonIndex: number = this.rows.findIndex(x => x[this.DATA_PK] === action[this.MANAGE_FIELD][this.DATA_PK]);
    switch (action['type'].name) {
      case "ADD":
        this.rows.push(action['conflict_reason']);
        this.page.totalElements++;
        break;
      case "DELETE":
        this.rows.splice(conflictReasonIndex, 1);
        this.page.totalElements--;
        break;
      case "EDIT":
        this.rows[conflictReasonIndex] = action[this.MANAGE_FIELD];
        break;
    }
  }
}
