import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {NotificationsService} from 'angular2-notifications';
import {AuthToken} from '../kernel/model/auth-token';
import {User} from '../kernel/model/user';
import {TranslateService} from '@ngx-translate/core';
import {ApiOptions} from '../kernel/config/api.config';
import {ApiService} from '../kernel/services/api.service';
import {finalize} from "rxjs/operators";
import {SessionService} from "../kernel/services/session.service";
import {SessionSingleton} from "../kernel/singletons/session.singleton";
import {NgTranslatesService} from "../kernel/services/ng-translates.service";
import {Permission} from "../kernel/model/Permission";

@Component({
  selector: 'main-content',
  templateUrl: '../templates/login.component.html'
})

export class LoginComponent implements OnInit {
  public coords = {lat: 0, lng: 0};
  public user: User = new User();
  public permissions: Array<Permission> = new Array<Permission>();
  public extendedSession: boolean = false;

  constructor(private router: Router,
              private api: ApiService,
              private loadingBar: LoadingBarService,
              private notify: NotificationsService,
              private translate: TranslateService,
              private sessMan: SessionService,
              private session: SessionSingleton,
              private ngTranslateWrapper: NgTranslatesService) {
  }

  submitSignInForm(): void {
    this.loadingBar.start();

    this.api.post("rest/auth/login", {user: this.user, coords: this.coords, extended_session: this.extendedSession})
      .pipe(finalize(() => {
        this.loadingBar.complete();
      }))
      .subscribe(
        (authToken: AuthToken) => {
          this.sessMan.setToken(authToken);
          this.sessMan.setTokenId(authToken);
          this.initUserSession();
        });
  }

  /* fix para error 401 al hacer login: forzar carga del usuario antes de continuar */
  initUserSession() {
    this.session.getUser(true).then((user: User) => {
      try {
        if (null === user) {
          setTimeout(() => this.initUserSession(), 500);
        }
        else {
          this.ngTranslateWrapper.setTranslate(user.lang_code);
          this.initUserPermissions();
        }
      }
      catch (e) {
        setTimeout(() => this.initUserSession(), 500);
      }
    }, () => {
      setTimeout(() => this.initUserSession(), 500);
    });
  }
  /* fix para reconexiones y que no se mantengan los permisos de la sesión anterior */
  initUserPermissions() {

    this.session.getPermissions(true).then((permissions: Array<Permission>) => {
      try {
        if (null === permissions) {
          setTimeout(() => this.initUserPermissions(), 500);
        }
        else if(permissions.length > 0) {
          this.router.navigate(['dashboard']);
        }
      }
      catch (e) {
        setTimeout(() => this.initUserPermissions(), 500);
      }
    }, () => {
      setTimeout(() => this.initUserPermissions(), 500);
    });

  }

  ngOnInit() {
    this.getLocation();
  }

  private getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.initPosition.bind(this), this.errorPosition.bind(this), {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      });
    } else {
      this.translate.get("notifications.GEOLOCATION_UNSUPPORTED").subscribe((res: string) => {
        this.notify.warn(
          "",
          res
        );
      });
    }
  }

  private initPosition(position) {
    this.coords.lat = position.coords.latitude;
    this.coords.lng = position.coords.longitude;
  }

  private errorPosition() {
    this.translate.get("notifications.GEOLOCATION_DENIED").subscribe((res: string) => {
      this.notify.warn(
        "",
        res
      );
    });
  }
}
