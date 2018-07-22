import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CanActivate} from '@angular/router';
import {AuthService} from './auth.service';
import {WsAuthService} from '../services/ws-auth.service';
import {NotificationsService} from "angular2-notifications";
import {TranslateService} from "@ngx-translate/core";
import {SessionService} from "./session.service";

@Injectable()
export class LoggedInService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private wsAuth: WsAuthService, private notify: NotificationsService, private translate: TranslateService, private sessMan:SessionService) {
  }

  canActivate(): boolean {
    const token = this.sessMan.getToken();
    if (!this.authService.loggedIn() && null !== token  && "" != token) {
      this.router.navigate(['login']);
      return false;
    }
    else if (!this.authService.loggedIn()) {
      this.translate.get('notifications.SESSION_EXPIRED').subscribe((res: string) => {
        this.notify.warn(
          "",
          res
        );
      });

      this.router.navigate(['login']);
      return false;
    }
    this.logoutWhenTokenExpire();
    if (sessionStorage.getItem("authConnected") === null || !!sessionStorage.getItem("authConnected") === false) {
      this.wsAuth.loggedInGuard();
    }
    return true;
  }

  canActivateChild(): boolean {
    return this.canActivate();
  }

  logoutWhenTokenExpire() {
    setTimeout(() => {
      this.canActivate();
    }, this.authService.tokenExpireMsLeft());
  }
}
