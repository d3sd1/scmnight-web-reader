import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {WsService} from '../../kernel/services/ws.service';
import {TablePage} from '../../kernel/model/table-page';
import {ClientEntrance} from '../../kernel/model/client-entrance';
import {ClientsMock} from '../../kernel/mock/clients.mock';
import {deserialize} from 'json-typescript-mapper';
import {Client} from "../../kernel/model/client";
import {ConflictReason} from "../../kernel/model/conflict-reason";
import {MzModalComponent} from "ngx-materialize";
import {HttpErrorResponse} from "@angular/common/http";
import {ApiService} from "../../kernel/services/api.service";
import {Gender} from "../../kernel/model/gender";
import { map, filter, catchError, mergeMap, finalize } from 'rxjs/operators';

@Component({
    templateUrl: '../../templates/clients.data.component.html',
    providers: [
        ClientsMock
    ],
})

export class RoomClientDataComponent implements OnInit, AfterViewInit, OnDestroy {
  page = new TablePage();
  rows = new Array<Client>();
  loading: boolean = false;
  genders: Array<Gender> = [];
  actualClient: Client = new Client();

  @ViewChild('editExtraDataModal') editExtraDataModal: MzModalComponent;
  public modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%'
  };

  ngOnInit(): void {
    this.loading = true;
    this.setPage({offset: 0});
    this.api.get("rest/clients/genders")
      .subscribe(
        (genders: Array<ConflictReason>) => {
          this.genders = genders;
        }
      );
  }

  onClientJoin(uri: any, data: any) {
    let entrance = deserialize(ClientEntrance, JSON.parse(data));
    const foundRow = this.rows.findIndex((el) => {
      return el.dni == entrance.client.dni;
    });
    if(foundRow === -1)
    {
      this.rows.push(entrance.client);
    }
  }

  ngOnDestroy(): void {
    this.ws.unsubscribe("scm/clients_extradata");
    this.ws.unsubscribe("scm/clients_entrances");
    this.editExtraDataModal.closeModal();
  }

  ngAfterViewInit() {
    this.ws.subscribe("scm/clients_extradata", this.onClientUpdate.bind(this));
    this.ws.subscribe("scm/clients_entrances", this.onClientJoin.bind(this));
  }

  onClientUpdate(uri: any, data: any) {
    const updatedClient = deserialize(Client, JSON.parse(data));
    /*
    * Update only editable data: email, address, sex.
     */
    const updatedUserRow = this.rows.findIndex((el) => {
      return el.dni == updatedClient.dni;
    });
    this.rows[updatedUserRow].email = updatedClient.email;
    this.rows[updatedUserRow].address = updatedClient.address;
    this.rows[updatedUserRow].gender = updatedClient.gender;
  }

  constructor(private serverResultsService: ClientsMock, private ws: WsService, private api: ApiService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
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
    /* nos valen los conflictivos, ya que esto devuelve todos los usuarios */
    this.serverResultsService.getConflictiveResults(this.page).subscribe(pagedData => {
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

  editExtraData(client: Client) {
    this.setPage({offset: 0});
    this.actualClient = client;
    this.editExtraDataModal.openModal();
  }

  setExtraData() {
    /* FIX PARA FECHAS DE REST: AQUI NO HACE FALTA EL BIRTHDATE */
    this.actualClient.birthdate = null;
    this.api.post("rest/clients/extradata", this.actualClient)
      .pipe(finalize(() => {
        this.editExtraDataModal.closeModal();
      }))
      .subscribe(
        (data: Array<ConflictReason>) => {
          this.actualClient = new Client();
        },
        (error: HttpErrorResponse) => {
        }
      );
  }
}
