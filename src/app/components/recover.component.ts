import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {NotificationsService} from 'angular2-notifications';
import {AuthToken} from '../kernel/model/auth-token';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../kernel/services/api.service';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {finalize} from "rxjs/operators";
import {User} from "../kernel/model/user";

@Component({
  selector: 'main-content',
  templateUrl: '../templates/recover.component.html'
})

export class RecoverComponent {
  public user: User = new User();
  public isPropietary: boolean = false;

  constructor(private router: Router,
              private api: ApiService,
              private loadingBar: LoadingBarService,
              private notify: NotificationsService,
              private translate: TranslateService) {
  }

  recoverAccountForm(): void {
    if (this.isPropietary) {
      this.loadingBar.start();
      this.user.lang_code = this.translate.getBrowserLang();
      this.api.post("rest/auth/recover", this.user)
        .pipe(finalize(() => {
          this.loadingBar.complete();
        }))
        .subscribe(
          () => {
            this.router.navigate(['recover/code']);
          });
    }
    else {
      this.translate.get("recover.error_propietary").subscribe((res: string) => {
        this.notify.error(
          "",
          res
        );
      });
    }
  }
}
