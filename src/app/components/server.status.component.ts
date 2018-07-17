import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {NotificationOptions} from '../kernel/config/notifications.config';
import {PreloaderService} from '../kernel/services/preloader.service';
import {SessionSingleton} from "../kernel/singletons/session.singleton";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../kernel/services/auth.service";
import {Config} from "../kernel/model/config";
import {WsService} from "../kernel/services/ws.service";
import {NotificationsService} from "angular2-notifications";
import {UserEntrance} from "../kernel/model/user-entrance";
import {HttpErrorResponse} from "@angular/common/http";
import {ClientEntrance} from "../kernel/model/client-entrance";
import {ApiService} from "../kernel/services/api.service";

@Component({
  templateUrl: '../templates/server.status.component.html'
})
export class ServerStatusComponent {
  single = [
    {
      "name": "Germany",
      "value": 8940000
    }
  ];
  customColors = [
    {
      name: 'Germany',
      value: '#0000ff'
    }
  ];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // line, area
  autoScale = true;

  constructor() {

  }

  onSelect(event) {
    console.log(event);
  }
}
