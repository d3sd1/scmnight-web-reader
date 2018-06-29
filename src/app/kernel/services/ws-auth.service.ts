import {Injectable} from '@angular/core';
import {WsService} from '../../kernel/services/ws.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationsService} from 'angular2-notifications';
import {ApiOptions} from '../config/api.config';
import {Router} from '@angular/router';

@Injectable()
export class WsAuthService {
    constructor(private notify: NotificationsService, private translate: TranslateService, private ws: WsService, private router:Router) {
    }
    loggedInGuard() {
        this.ws.subscribe("scm/auth", this.loginSocketCallback.bind(this));
    }
    loggedOutGuard() {
        this.ws.unsubscribe("scm/auth");
    }
    private loginSocketCallback(uri: any, data: any) {
        let parsedData = JSON.parse(data),
            logoutUsers = parsedData["logoutUsers"],
            myToken = localStorage.getItem(ApiOptions.tokenParameter);
        logoutUsers.forEach((logoutToken) => {
            if (logoutToken["token"] === myToken) {
              localStorage.clear();
              this.router.navigate(['error/406']);
              this.notify.warn(
                "",
                this.translate.get("notifications.CONNECTED_OTHERWHERE")["value"]
              );
            }
        });
    }
}
