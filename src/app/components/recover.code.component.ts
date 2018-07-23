import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {ApiService} from '../kernel/services/api.service';
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
              private loadingBar: LoadingBarService) {
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
