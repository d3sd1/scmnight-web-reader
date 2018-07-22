import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {NotificationsService} from 'angular2-notifications';
import {AuthToken} from '../kernel/model/auth-token';
import {TranslateService} from '@ngx-translate/core';
import {ApiOptions} from '../kernel/config/api.config';
import {ApiService} from '../kernel/services/api.service';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {finalize} from "rxjs/operators";
import {RecoverCode} from "../kernel/model/recover-code";

@Component({
  selector: 'main-content',
  templateUrl: '../templates/recover.code.component.html'
})

export class RecoverCodeComponent {
  public code: string;

  constructor(private router: Router,
              private api: ApiService,
              private loadingBar: LoadingBarService,
              private notify: NotificationsService,
              private translate: TranslateService) {
  }

  finalRecoverAccount(): void {
    this.loadingBar.start();

    const recoverCode = new RecoverCode();
    recoverCode.code = this.code;
    this.api.post("rest/auth/recover/code", recoverCode)
      .pipe(finalize(() => {
        this.loadingBar.complete();
      }))
      .subscribe(() => {
        this.router.navigate(["login"]);
      });
  }
}
