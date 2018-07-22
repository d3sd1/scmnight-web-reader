import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {environment} from '../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../kernel/model/user';
import {SessionSingleton} from '../kernel/singletons/session.singleton';
import {trigger, style, animate, transition} from '@angular/animations';
import {AuthToken} from "../kernel/model/auth-token";
import {ApiOptions} from "../kernel/config/api.config";
import {ApiService} from "../kernel/services/api.service";
import {LoadingBarService} from '@ngx-loading-bar/core';
import {NotificationsService} from "angular2-notifications";
import {finalize} from "rxjs/operators";
import {NgTranslatesService} from "../kernel/services/ng-translates.service";

@Component({
  templateUrl: '../templates/profile.component.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('500ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('250ms', style({opacity: 0}))
        ])
      ]
    )
  ],
})

export class ProfileComponent implements OnInit, OnDestroy {
  user: User = new User();
  showPasswordChanger = false;
  newPass1: string = "";
  newPass2: string = "";
  private changedLanguage = false;
  private baseLang: string = "";

  constructor(public translate: TranslateService, private sessionInfo: SessionSingleton, private api: ApiService, private loadingBar: LoadingBarService,
              private notify: NotificationsService, private ngTranslateWrapper: NgTranslatesService) {

  }

  public languages: Array<String> = environment.availableLangs;

  ngOnDestroy() {
    if (this.changedLanguage) {
      this.ngTranslateWrapper.setTranslate(this.baseLang);
      this.changedLanguage = false;
    }
  }

  changeLanguage() {
    this.changedLanguage = true;
    if (-1 !== this.languages.findIndex(x => x == this.user.lang_code)) {
      this.ngTranslateWrapper.setTranslate(this.user.lang_code);
    }
    else {
      this.ngTranslateWrapper.setTranslate(environment.availableLangs[0]);
    }
  }

  submitProfile() {
    if (this.showPasswordChanger && ((this.newPass1 != "" && this.newPass1 != null) || (this.newPass2 != "" && this.newPass2 != null))) {
      if (this.newPass1 == this.newPass2) {
        this.user.newpass = this.newPass1;
      }
      else {

        this.translate.get('api_notifications.NEW_PASSWORDS_DOESNT_MATCH').subscribe((res: string) => {
          this.notify.error(
            "",
            res
          );
        });

        return;
      }
    }
    this.api.post("rest/user/info", this.user)
      .pipe(finalize(() => {
        this.loadingBar.complete();
        this.user.password = null;
        this.user.newpass = null;
        this.newPass1 = null;
        this.newPass2 = null;
        this.showPasswordChanger = false;
        this.changedLanguage = false;
        this.sessionInfo.getUser(true).then(() => {
        });
      }))
      .subscribe(
        (authToken: AuthToken) => {
        });
  }

  ngOnInit() {
    this.sessionInfo.getUser(true).then(res => {
      this.user = res;
      this.baseLang = res.lang_code;
    });
  }
}
