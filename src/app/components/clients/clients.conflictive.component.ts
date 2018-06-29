import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {WsService} from '../../kernel/services/ws.service';
import {TablePage} from '../../kernel/model/table-page';
import {ClientsMock} from '../../kernel/mock/clients.mock';
import {deserialize} from 'json-typescript-mapper';
import {Client} from "../../kernel/model/client";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {User} from "../../kernel/model/user";
import {MzModalComponent} from "ng2-materialize";
import {ApiService} from "../../kernel/services/api.service";
import {ClientBanType} from "../../kernel/model/client.ban.type";

@Component({
  templateUrl: '../../templates/clients.conflictive.component.html',
  providers: [
    ClientsMock
  ],
})

export class ClientsConflictiveComponent implements OnInit, AfterViewInit, OnDestroy {
  page = new TablePage();
  rows = new Array<Client>();
  loading: boolean = false;
  conflictiveReasons: Array<ClientBanType>;
  private actualClient: Client = null;

  @ViewChild('editConflictivity') editConflictivity: MzModalComponent;
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
    this.api.get("rest/clients/conflictive_reasons")
      .finally(() => {
        this.editConflictivity.close();
      })
      .subscribe(
        (data: Array<ClientBanType>) => {
          this.conflictiveReasons = data;
        },
        (error: HttpErrorResponse) => {
        }
      );
  }

  ngOnDestroy(): void {
    this.ws.unsubscribe("scm/clients_conflictive");
  }

  ngAfterViewInit() {
    this.ws.subscribe("scm/clients_conflictive", this.onClientUpdate.bind(this));
  }

  onClientUpdate(uri: any, data: any) {
    const updatedData = JSON.parse(data);
    if (null !== this.actualClient && this.actualClient.dni == updatedData.client.dni) {
      this.clearConflictivityBoxes();
      this.setConflictivityBoxes(updatedData.conflictivies);
    }
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

  clearConflictivityBoxes() {
    this.conflictiveReasons.forEach(function (el) {
      el.checked = false;
    });
  }

  setConflictivityBoxes(conflictibityReasons: Array<ClientBanType>) {
    if (typeof conflictibityReasons == "object") {
      this.conflictiveReasons.forEach((el, index) => {
        const isChecked = conflictibityReasons.some(x => {
          return el.id == x.id;
        });
        if (isChecked) {
          this.conflictiveReasons[index].checked = true;
        }
      });
    }
  }

  getConflictivity() {
    let conflictivity: Array<ClientBanType> = [];
    this.conflictiveReasons.forEach((el, index) => {
      if (el.checked) {
        conflictivity.push(this.conflictiveReasons[index]);
      }
    });
    return conflictivity;
  }

  checkConflictive(client: Client) {
    this.clearConflictivityBoxes();
    this.setPage({offset: 0});
    this.actualClient = client;
    this.api.get("rest/clients/conflictive/" + client.dni)
      .finally(() => {
        this.editConflictivity.open();
      })
      .subscribe(
        (data: Array<ClientBanType>) => {
          this.setConflictivityBoxes(data);
        },
        (error: HttpErrorResponse) => {
        }
      );
  }

  setConflictive() {
    this.api.post("rest/clients/conflictive/" + this.actualClient.dni, this.getConflictivity())
      .finally(() => {
        this.editConflictivity.close();
      })
      .subscribe(
        (data: Array<ClientBanType>) => {
          this.actualClient = null;
        },
        (error: HttpErrorResponse) => {
        }
      );
  }

  changeConflictStatus(id: number, actualStatus: boolean) {
    this.conflictiveReasons[this.conflictiveReasons.findIndex(x => x.id == id)].checked = !actualStatus;
  }
}
