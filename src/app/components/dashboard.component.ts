import {AfterContentInit, AfterViewInit, Component, OnDestroy} from '@angular/core';
import {UserEntrance} from "../kernel/model/user-entrance";
import {deserialize} from "json-typescript-mapper";
import {WsService} from "../kernel/services/ws.service";
import {UsersMock} from "../kernel/mock/users.mock";
import {TranslateService} from "@ngx-translate/core";
import {ApiService} from "../kernel/services/api.service";
import {UserRoom} from "../kernel/model/user-room";
import {ResponseMessage} from "../kernel/model/response-message";
import {User} from "../kernel/model/user";
import {Config} from "../kernel/model/config";
import {HttpErrorResponse} from "@angular/common/http";
import {ClientEntrance} from "../kernel/model/client-entrance";
import {ToastrService} from "ngx-toastr";

@Component({
  templateUrl: '../templates/dashboard.component.html',
})

export class DashboardComponent implements OnDestroy, AfterViewInit {
  maxClients = 1;
  colorScheme = {
    domain: ['#B3E5FC']
  };

  loading = true;
  roomUsers: any[] = [
    {
      name: "",
      loading: true,
      realUsers: 0,
      series: [{
        name: "LOADING",
        value: 0
      }]
    }
  ];
  roomClients: any[] = [
    {
      name: "",
      loading: true,
      realClients: 0,
      series: [{
        name: "LOADING",
        value: 0
      }]
    }
  ];

  constructor(private ws: WsService, private api: ApiService, private toastr: ToastrService, private translate: TranslateService) {
    this.translate.get("dashboard.clientschart.users").subscribe((res: string) => {
      this.roomClients[0].name = res;
    });
    this.translate.get("dashboard.userschart.users").subscribe((res: string) => {
      this.roomUsers[0].name = res;
    });
  }

  ngOnDestroy(): void {
    this.ws.unsubscribe("scm/users_entrances");
    this.ws.unsubscribe("scm/clients_entrances");
  }

  ngAfterViewInit() {
    this.ws.subscribe("scm/users_entrances", this.onUserEnter.bind(this));
    this.ws.subscribe("scm/clients_entrances", this.onClientEnter.bind(this));
    this.api.get('rest/config/find/maxPersonsInRoom')
      .subscribe(
        (config: Config) => {
          this.maxClients = parseInt(config.value);
        },
        (err: HttpErrorResponse) => {

        });
    this.api.get('rest/user/entrances/all')
      .subscribe(
        (usersEntrances: UserEntrance[]) => {
          this.roomUsers[0]["series"] = [];
          if (usersEntrances.length > 0) {
            usersEntrances.forEach((userRoom: UserEntrance) => {
              this.onUserEnter("_INITIAL_ENTRANCE_", userRoom);
            });
          }
          this.roomUsers[0]["loading"] = false;
        },
        (err: HttpErrorResponse) => {

        });
    this.api.get('rest/client/entrances/all')
      .subscribe(
        (clientsEntrances: ClientEntrance[]) => {
          this.roomClients[0]["series"] = [];
          if (clientsEntrances.length > 0) {
            clientsEntrances.forEach((clientEntrances: ClientEntrance) => {
              this.onClientEnter("_INITIAL_ENTRANCE_", clientEntrances);
            });
          }
          this.roomClients[0]["loading"] = false;
        },
        (err: HttpErrorResponse) => {

        });
  }

  onUserEnter(uri: any, data: any) {
    let entrance: UserEntrance;
    if (uri !== "_INITIAL_ENTRANCE_") {
      entrance = JSON.parse(data);
      entrance.date = new Date(entrance.date);
    }
    else {
      entrance = data;
    }
    let entranceSum: number = 1;
    if (entrance.type.name !== "JOIN") {
      entranceSum = -1;
    }
    this.roomUsers[0]["realUsers"] = this.roomUsers[0]["realUsers"] + entranceSum;
    const entranceDate = new Date(entrance.date);

    this.roomUsers[0]["series"].push({
      id: entrance.id,
      name: ("0" + entranceDate.getHours()).slice(-2) + ":" + ("0" + entranceDate.getMinutes()).slice(-2),
      value: this.roomUsers[0]["realUsers"]
    });
    this.roomUsers = [...this.roomUsers];
  }

  onClientEnter(uri: any, data: any) {
    let entrance: ClientEntrance;
    if (uri !== "_INITIAL_ENTRANCE_") {
      entrance = JSON.parse(data);
      entrance.date = new Date(entrance.date);
    }
    else {
      entrance = data;
    }
    let entranceSum: number = 1;
    if (entrance.type.name === "LEAVE") {
      entranceSum = -1;
    }
    this.roomClients[0]["realClients"] = this.roomClients[0]["realClients"] + entranceSum;
    const entranceDate = new Date(entrance.date);

    this.roomClients[0]["series"].push({
      id: entrance.id,
      name: ("0" + entranceDate.getHours()).slice(-2) + ":" + ("0" + entranceDate.getMinutes()).slice(-2),
      value: this.roomClients[0]["realClients"]
    });
    this.roomClients = [...this.roomClients];
  }
}
