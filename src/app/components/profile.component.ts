import {Component, OnInit, Input} from '@angular/core';
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

export class ProfileComponent implements OnInit {
  user: User = new User();
  showPasswordChanger = false;
  newPass1: string = "";
  newPass2: string = "";

  constructor(public translate: TranslateService, private sessionInfo: SessionSingleton, private api: ApiService, private loadingBar: LoadingBarService,
              private notify: NotificationsService) {

  }

  public languages: Array<String> = environment.availableLangs;

  changeLanguage() {
    if (-1 !== this.languages.findIndex(x => x == this.user.lang_code)) {
      this.translate.setDefaultLang(this.user.lang_code);
      this.translate.use(this.user.lang_code);
    }
    else {
      this.translate.setDefaultLang(environment.availableLangs[0]);
      this.translate.use(environment.availableLangs[0]);
    }
  }

  submitProfile() {
    if (this.showPasswordChanger && ((this.newPass1 != "" && this.newPass1 != null) || (this.newPass2 != "" && this.newPass2 != null))) {
      if (this.newPass1 == this.newPass2) {
        this.user.newpass = this.newPass1;
      }
      else {
        this.notify.error(
          "",
          this.translate.get("api_notifications.NEW_PASSWORDS_DOESNT_MATCH")["value"]
        );
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
        this.sessionInfo.getUser(true).then(() => {});
      }))
      .subscribe(
        (authToken: AuthToken) => {
        });
  }

  ngOnInit() {
    this.sessionInfo.getUser().then(res => {
      this.user = res;
      console.log("user", this.user);
    });
  }
}
