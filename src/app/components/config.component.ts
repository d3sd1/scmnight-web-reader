import {Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, Input, ViewChild, ElementRef} from '@angular/core';
import {WsService} from '../kernel/services/ws.service';
import {TablePage} from '../kernel/model/table-page';
import {ApiOptions} from '../kernel/config/api.config';
import {Config} from '../kernel/model/config';
import {ConfigManage} from '../kernel/model/config-manage';
import {ConfigMock} from '../kernel/mock/config.mock';
import {ApiService} from '../kernel/services/api.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {deserialize} from 'json-typescript-mapper';
import {MzBaseModal, MzModalComponent, MzModalService} from "ngx-materialize";
import {finalize} from "rxjs/operators";

@Component({
  templateUrl: '../templates/config.component.html',
  providers: [
    ConfigMock
  ],
})

export class ConfigComponent implements OnInit, AfterViewInit, OnDestroy {
  page = new TablePage();
  rows = new Array<Config>();
  loading: boolean = false;
  ranks: number[] = ApiOptions.ranks;
  @ViewChild('configActionModal') modal: MzModalComponent;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
  };

  constructor(private serverResultsService: ConfigMock, private ws: WsService, private api: ApiService, private toastr: ToastrService, private translate: TranslateService, private modalService: MzModalService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  /* Manage config */
  modalConfig: Config = new Config();

  editConfigModal(config: Config) {
    this.modalConfig = new Config(config);
    this.modal.openModal();
  }

  editConfigRest() {

    this.api.post("rest/config/mod", this.modalConfig).pipe(finalize(() => {
      this.modalConfig = new Config();
    })).subscribe(
      (data: HttpResponse<Config>) => {

      },
      (error: HttpErrorResponse) => {
      },
      () => {
        this.modal.closeModal();
      });
  }

  ngOnInit(): void {
    this.loading = true;
    this.setPage({offset: 0});
  }

  ngOnDestroy(): void {
    this.ws.unsubscribe("scm/config_manage");
    this.modal.closeModal();
  }

  ngAfterViewInit() {
    this.ws.subscribe("scm/config_manage", this.onChangeConfig.bind(this));
  }

  private onChangeConfig(uri: any, data: any) {
    let action: ConfigManage = deserialize(ConfigManage, JSON.parse(data)),
      configIndex: number = this.rows.findIndex(x => x.config === action.target_config.config)
    this.rows[configIndex] = action.target_config;
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
    this.serverResultsService.getAllConfigs(this.page).subscribe(pagedData => {
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
